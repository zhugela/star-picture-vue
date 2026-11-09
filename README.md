# star-picture-vue · Picture Library Frontend

> Vue 3 frontend for [StarPicture](https://github.com/zhugela/StarPicture) — browse, upload, crop and AI-edit pictures across personal and team spaces.

![Vue](https://img.shields.io/badge/Vue-3-42b883?logo=vuedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-state-f7d336)
![Ant Design Vue](https://img.shields.io/badge/Ant%20Design%20Vue-4-1677ff)

---

## Features

| Area | Capability |
|---|---|
| Spaces | personal and team spaces, create / edit / switch |
| Pictures | list, detail, upload (single + batch), edit, delete |
| Editing | in-browser crop, rotate, colour picking, AI out-painting trigger |
| Search | keyword search and URL-based upload |
| State | Pinia stores per domain, typed API layer over axios |

## Stack

Vue 3 · Vite · Pinia · Vue Router · Ant Design Vue · axios · dayjs · vue-cropper · vue3-colorpicker · file-saver

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
```

Point `VITE_API_BASE_URL` at a running StarPicture backend (default `http://localhost:8101`).

## Structure

```
src/
├── api/           typed axios wrappers
├── pages/         list / detail / batch-create / my-space
├── components/    ImageCropper · ImageOutPainting · BatchEditPictureModal
├── stores/        Pinia stores
├── router/
└── layouts/
```

## Status

Companion to the backend course project. Batch operations and out-painting are the most recently added areas.
