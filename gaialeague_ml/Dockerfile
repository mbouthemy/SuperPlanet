FROM python:3.8

LABEL maintainer="neroks01@gmail.com"

EXPOSE 8000 8080

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE 1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED 1

RUN apt-get update \
    && apt-get install -y \
        build-essential \
        cmake \
        git \
        wget \
        unzip \
        yasm \
        pkg-config \
        libswscale-dev \
        libtbb2 \
        libtbb-dev \
        libjpeg-dev \
        libpng-dev \
        libtiff-dev \
        libavformat-dev \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

RUN pip install numpy

WORKDIR /
ENV OPENCV_VERSION="4.1.1"
RUN wget https://github.com/opencv/opencv/archive/${OPENCV_VERSION}.zip \
&& unzip ${OPENCV_VERSION}.zip \
&& mkdir /opencv-${OPENCV_VERSION}/cmake_binary \
&& cd /opencv-${OPENCV_VERSION}/cmake_binary \
&& cmake -DBUILD_TIFF=ON \
  -DBUILD_opencv_java=OFF \
  -DWITH_CUDA=OFF \
  -DWITH_OPENGL=ON \
  -DWITH_OPENCL=ON \
  -DWITH_IPP=ON \
  -DWITH_TBB=ON \
  -DWITH_EIGEN=ON \
  -DWITH_V4L=ON \
  -DBUILD_TESTS=OFF \
  -DBUILD_PERF_TESTS=OFF \
  -DCMAKE_BUILD_TYPE=RELEASE \
  -DCMAKE_INSTALL_PREFIX=$(python3.8 -c "import sys; print(sys.prefix)") \
  -DPYTHON_EXECUTABLE=$(which python3.8) \
  -DPYTHON_INCLUDE_DIR=$(python3.8 -c "from distutils.sysconfig import get_python_inc; print(get_python_inc())") \
  -DPYTHON_PACKAGES_PATH=$(python3.8 -c "from distutils.sysconfig import get_python_lib; print(get_python_lib())") \
  .. \
&& make install \
&& rm /${OPENCV_VERSION}.zip \
&& rm -r /opencv-${OPENCV_VERSION}
RUN ln -s \
  /usr/local/python/cv2/python-3.8/cv2.cpython-38m-x86_64-linux-gnu.so \
  /usr/local/lib/python3.8/site-packages/cv2.so

WORKDIR /app


# Install pip requirements
RUN pip install torch==1.6.0+cpu torchvision==0.7.0+cpu -f https://download.pytorch.org/whl/torch_stable.html

ADD requirements.txt .
RUN python -m pip install -r requirements.txt

# ARG DJANGO_SECRET_KEY
ENV DJANGO_SECRET_KEY="\!JsVF)%XD\.yZXbh[&c6vbM4rHmYuTg"

ADD . /app

# RUN mkdir -p checkpoints/kaggle_effdetv5/effdet5-cutmix-augmix
# RUN pip install --upgrade gdown
# RUN gdown 'https://drive.google.com/uc?id=125zgme_To6fZCxoMZZMIH6CxytHjj75-' 
# RUN mv best-checkpoint-012epoch.bin checkpoints/kaggle_effdetv5/effdet5-cutmix-augmix/

# RUN mkdir -p temp

CMD ["gunicorn", "--bind", "0.0.0.0:8080","--log-level", "debug", "--timeout", "180", "gaialeague_ml.wsgi"]