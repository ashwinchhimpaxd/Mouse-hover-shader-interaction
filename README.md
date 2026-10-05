
# Three.js Interactive Shader Animations

An open-source collection of interactive, mouse-driven shader animations built with [Three.js](https://threejs.org/) and custom GLSL shaders.

This repository is perfect for anyone looking to learn about or integrate interactive WebGL plane effects, smooth hover transitions, and raycasting in Three.js. 

## 🚀 Features
- **Interactive Mouse Hover:** Custom shader effects that react directly to your mouse position over a 3D plane.
- **Smooth Transitions:** Linear interpolation (Lerp) is used for buttery smooth enter/leave and movement effects.
- **Toggle Fullscreen:** Click interaction to toggle the plane's size to full-screen.
- **Responsive:** Automatically resizes, scales, and maintains aspect ratios with the browser window.

---

## 🛠️ Tech Stack & Requirements

This project is built using:
- **Core Library:** [Three.js](https://threejs.org/)
- **Shaders:** Custom GLSL (Vertex & Fragment shaders)
- **Bundler / Dev Server:** [Vite](https://vitejs.dev/)

---

## 💻 Getting Started

Follow these steps to clone and run the project locally on your machine:

### 1. Clone the repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install dependencies
Make sure you have [Node.js](https://nodejs.org/) installed, then run:
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```
This will start a local server (usually at `http://localhost:5173/`).

---

## 📂 Animations Included

This repository contains two different mouse hover animation logic scripts. You can switch between them by commenting/uncommenting the script imports in `index.html`.

### 1. Animation 1 (`src/script.js`)
* **How to use:** Active by default in `index.html`.
* **Description:** A fluid, distortion-based hover effect on an image plane.
* **Working Mechanism:** 
  - Uses a Three.js `Raycaster` to detect exactly when the user's mouse enters the image plane bounds.
  - Smoothly tracks the mouse coordinates (UVs) and passes them to the GLSL shader via a `uMouse` uniform.
  - **Click Interaction:** Clicking on the plane dynamically toggles it into full-screen mode by calculating the required scale based on the window's dimensions and updating the shader's aspect ratio.

### 2. Animation 2 (`src/script2.js`)
* **How to use:** Uncomment the line in `index.html` (and comment out `script.js`).
* **Description:** A highly smoothed hover and reveal effect.
* **Working Mechanism:** 
  - Uses the same raycasting technique to see if the mouse is inside or outside the image.
  - Tracks an "enter/leave" state (0 for outside, 1 for inside).
  - Uses Lerp (Linear Interpolation) to smoothly animate a `uMouseEnter` uniform in the shader from 0 to 1 over multiple frames. This creates a highly organic, fade-in and fade-out behavior for the shader effect when the mouse enters and leaves the boundaries.

---

## 📸 Screenshots / Demo

### Animation 1 (`script.js`)
*A dynamic, real-time wave distortion effect that follows your cursor.*
<img width="800" height="450" alt="videoone" src="https://github.com/user-attachments/assets/9c9dbc90-d24a-4eab-b89e-ecf2248482a3" />


### Animation 2 (`script2.js`)
*A smooth, organic hover reveal effect with fade-in and fade-out transitions.*

<img width="800" height="450" alt="videotwo" src="https://github.com/user-attachments/assets/4ef9f1bd-38f4-4660-b148-e48cb9d59120" />


---

## 🤝 Contributing
Feel free to fork this project, experiment with the GLSL shaders, add your own effects, and submit pull requests!

## 📜 License
This project is open-source and free to use!
