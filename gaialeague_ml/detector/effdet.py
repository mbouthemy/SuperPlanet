"""
Created on 2020-08-25 00:00:00

@author: neroksi
@co-author: mbouthemy

©SuperPlanet
"""

from ensemble_boxes import weighted_boxes_fusion
import torch
import numpy as np
import albumentations as A
from albumentations.pytorch.transforms import ToTensorV2
import cv2
import gc
# from matplotlib import pyplot as plt
from libs.efficientdet.effdet import get_efficientdet_config, EfficientDet, DetBenchEval
from libs.efficientdet.effdet.efficientdet import HeadNet

# from sklearn.model_selection import StratifiedKFold 

from gaialeague_ml.settings import BASE_DIR

VALID_TRANSFORMS =  A.Compose([
            A.Resize(height=512, width=512, p=1.0),
            ToTensorV2(p=1.0),
        ], p=1.0)
DEVICE = torch.device('cpu')

def imread(impath, transform=True):
    image = cv2.imread(impath, cv2.IMREAD_COLOR)
    assert image is not None, "Unable to read an image from  the path : `{}`".format(impath)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB).astype(np.float32)
    image /= 255.0
    h,w = image.shape[:2]

    if transform:
        sample = {'image': image}
        sample = VALID_TRANSFORMS(**sample)
        image = sample['image']

    return image,h,w

def load_net(checkpoint_path):
    config = get_efficientdet_config('tf_efficientdet_d5')
    net = EfficientDet(config, pretrained_backbone=False)

    config.num_classes = 1
    config.image_size=512
    net.class_net = HeadNet(config, num_outputs=config.num_classes, norm_kwargs=dict(eps=.001, momentum=.01))

    checkpoint = torch.load(checkpoint_path, map_location=DEVICE)
    net.load_state_dict(checkpoint['model_state_dict'])

    del checkpoint
    gc.collect()

    net = DetBenchEval(net, config)
    net.eval()
    return net.to(DEVICE)


# EFF_NET = load_net(BASE_DIR+'/checkpoints/best-checkpoint-003epoch.bin')
# EFF_NET = load_net(BASE_DIR+'/checkpoints/best-checkpoint-014epoch.bin')
# EFF_NET = load_net(BASE_DIR+'/checkpoints/best-checkpoint-012epoch.bin')
EFF_NET = load_net(BASE_DIR+'/checkpoints/kaggle_effdetv5/effdet5-cutmix-augmix/best-checkpoint-012epoch.bin')



def run_wbf(predictions, image_size=512, iou_thr=0.25, skip_box_thr=0.15, weights=None):
    boxes = [(prediction['boxes']/(image_size-1)).tolist()  for prediction in predictions]
    scores = [prediction['scores'].tolist()  for prediction in predictions]
    labels = [np.ones(prediction['scores'].shape[0]).tolist() for prediction in predictions]
    boxes, scores, labels = weighted_boxes_fusion(boxes, scores, labels, weights=None, iou_thr=iou_thr, 
                            skip_box_thr=skip_box_thr, conf_type="avg")
    boxes = boxes*(image_size-1)
    assert len(boxes) == len(scores) == len(labels)
    predictions ={
            "boxes": boxes,
            "scores": scores
        }
    return predictions

def rectangle(image, box):
    cv2.rectangle(image, (box[0], box[1]), (box[2], box[3]), (0, 0, 1), 3)
    return image


@torch.no_grad()
def make_predictions(impaths, score_threshold=0.075, wbf=True, draw_boxes=True):
    images, heights,widths = list(zip(*[imread(impath, transform=True) for impath in impaths]))
    images = torch.stack(images).to(DEVICE).float()

    predictions = []
    box_images = []
    det = EFF_NET(images, torch.tensor([1.]*len(images), dtype=torch.float32, device=DEVICE))
    for i, (impath, image, height, width) in enumerate(zip(impaths, images, heights, widths)):
        det_i = det[i].detach().cpu().numpy()
        boxes = det_i[:, :4]    
        scores = det_i[:,4]
        indexes = np.where(scores > score_threshold)[0]
        boxes = boxes[indexes]
        boxes[:, 2] = boxes[:, 2] + boxes[:, 0]
        boxes[:, 3] = boxes[:, 3] + boxes[:, 1]
        prediction = {
            'boxes': boxes[indexes],
            'scores': scores[indexes],
        }

        if wbf:
            prediction = run_wbf([prediction])
        
        prediction["boxes"] = prediction["boxes"].clip(0,511)

        prediction["boxes"][:, [1,3]] *= height/512
        prediction["boxes"][:, [0,2]] *= width/512

        prediction["boxes"] = prediction["boxes"].round(0).astype(np.int32)

        if draw_boxes:
            image,_,_ = imread(impath, transform=False)
            for box in prediction["boxes"]:
                rectangle(image, box)
            
            prediction["image"] = image
        else:
            prediction["image"] = None

        predictions.append(prediction)
    
    return predictions