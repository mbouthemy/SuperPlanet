# SuperPlanet
*Authors : Marin BOUTHEMY & Kossi NEROMA*


This project is a mobile application called SuperPlanet which is made to encourage children to clean up the planets.
It detects the number of garbage collected on two pictures (before and after the cleaning) and reward children with points accordingly.

We have used a machine learning algorithm for the image segmentation. It is a convolutional neural network made with the PyTorch framework.

It is made for the challenge of Pytorch Summer Hackathon 2020.

## Requirements
The library has some requirements :
 - React Native
 - Python
 - Django


# Machine Learning Explanation / Server Side

This is a an implementation in PyTorch of EfficientDet.

It is based on the

    official Tensorflow implementation by Mingxing Tan and the Google Brain team
    paper by Mingxing Tan, Ruoming Pang, Quoc V. Le EfficientDet: Scalable and Efficient Object Detection


You can find the API part inside the folder gaialeague_ml/detector.
The EffidientDet model is located in the gaialeague_ml/libs folder. We also reused part that we have already build for another Kaggle competition and we have adapted it based on the garbage dataset.


# App Explanation / Client Side


To install the app requirement you can run:

```
cd app
yarn install
react-native run-android
react-native start
```

## Files structure

The library contains the two following directories:

 - [app](https://github.com/mbouthemy/SuperPlanet/tree/master/app): which contains the mobile application:
     - Assets -> Images, Audios, Languages...
     - src/Views -> All the views of the application
     - src/Components -> All the components for the application
     - Inputs -> The inputs files.
 -  [gaialeague_ml](https://github.com/mbouthemy/SuperPlanet/tree/master/gaialeague_ml): which contains the server function used for Pytorch and Deep Learning comparison of the pictures
 
 
 
 

