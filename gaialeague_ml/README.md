# SuperPlanet
Let's make the Planet great again !


# The model
We trained an efficientDet with efficientNet B5 as backbone. We use transfer learning by initiating the model weights by those from ImageNet & Coco dataset.

We adpot a sine-annealing scheduler scheme where we start with a low learning rate (1e-5), increase it to some maximum value (1e-3) and decrease it to the starting point. This scheme is suitable for transfer learning. The model was trained for 50 epochs.

We use a many augmentations from the albumenation package as our training set was very small: about 1500 trash images from @Taco project.
