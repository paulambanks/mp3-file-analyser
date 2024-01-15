# MP3 FRAME COUNTER

![undraw_happy_music_g6wc.svg](https://raw.githubusercontent.com/paulambanks/mp3-file-analyser/main/apps/assets/undraw_happy_music_g6wc.svg)
---

![Javascript](https://img.shields.io/badge/Javascript-F0DB4F?style=for-the-badge&labelColor=black&logo=javascript&logoColor=F0DB4F) &nbsp;
![Typescript](https://img.shields.io/badge/Typescript-007acc?style=for-the-badge&labelColor=black&logo=typescript&logoColor=007acc) &nbsp;
![Svelte](https://img.shields.io/badge/svelte-%23f1413d.svg?style=for-the-badge&logo=svelte&logoColor=white) &nbsp;
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) &nbsp;
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-092749?style=for-the-badge&logo=tailwindcss&logoColor=06B6D4&labelColor=000000) &nbsp;
![Nodejs](https://img.shields.io/badge/Nodejs-3C873A?style=for-the-badge&labelColor=black&logo=node.js&logoColor=3C873A) &nbsp;
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) &nbsp;
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) &nbsp;
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) &nbsp;
![Yarn](https://img.shields.io/badge/yarn-%232C8EBB.svg?style=for-the-badge&logo=yarn&logoColor=white) &nbsp;
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

---

## Introduction

MP3 frame counter aims to provide an API endpoint that accepts an MP3 file and responds with the number of frames in the file.
The endpoint should successfully count the number of frames for MPEG Version 1 Audio Layer 3 files.

Documents used:
1. [MP3 WIKI](https://en.wikipedia.org/wiki/MP3#/media/File:Mp3filestructure.svg)
2. [Frame Header](http://www.mp3-tech.org/programmer/frame_header.html#:~:text=The%20frame%20header%20itself%20is,feature%20an%20optional%20CRC%20checksum.)

---

## Development
### Getting started

I assume that docker is both installed and running.
https://docs.docker.com/get-docker



1. Clone the repo
2. Please use Yarn as a package manager
2. Build the Docker containers
3. Access the app via Svelte http://localhost:5173/

```shell
git clone https://github.com/paulambanks/mp3-file-analyser.git
cd mp3-file-analyser

docker compose up
```

```
# API
Express Server is running on http://localhost:3000

# SVELTE FE
Svelte app is running on http://localhost:5173
```

### Running tests

1. Access API codebase
2. Re-run yarn install
3. Run tests

```shell
cd apps/express-api
yarn test
```

### Interacting with the API

1. Directly with the API (Curl) - with already existing sample or by passing a new filepath

```shell
curl -Ss -X POST http://localhost:3000/file-upload -F "file=@apps/express-api/fixtures/sample.mp3"
```

2. Front-End uploader

<img alt="uploader" src="https://raw.githubusercontent.com/paulambanks/mp3-file-analyser/main/apps/assets/uploader.png" width=50% height=50%>

Successful upload:

<img alt="uploader-success" src="https://raw.githubusercontent.com/paulambanks/mp3-file-analyser/main/apps/assets/uploader-success.png" width=50% height=50%>

Errors:

<img alt="uploader-errors" src="https://raw.githubusercontent.com/paulambanks/mp3-file-analyser/main/apps/assets/uploader-error.png" width=50% height=50%>

---



