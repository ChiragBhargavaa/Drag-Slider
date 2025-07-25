# Drag Slider

This is initial JSX + Tailwind code for the Drag Slider component.

Demo: https://drag-slider-wheat.vercel.app/

### Installation

This component is built using JSX and Tailwind CSS. It depends on GSAP, so make sure to install it:

```bash
npm install gsap
```

You can download the component and use it anywhere in your React project.

[➡️ Download DragSlider.jsx](https://raw.githubusercontent.com/ChiragBhargavaa/Drag-Slider/main/src/DragSlider.jsx)

### Explanation

```jsx
<DragSlider
  containerWidth="80"
  imgWidth="48"
  containerHeight="50"
  images={[img1, img2, img3, img4, img5, img6, img7, img8]}
  fadeMask={true} 
  showDragHint={true}
/>
```

| Prop              | Type     | Description |
|-------------------|----------|-------------|
| `containerWidth`  | `number` | The width of the entire slider container, in **viewport width (vw)**. Example: `80` means 80% of screen width. |
| `imgWidth`        | `number` | Width of each image inside the slider, also in **vw**. Setting it smaller than the container creates space for dragging. |
| `containerHeight` | `number` | The height of each image, in **viewport height (vh)**. On mobile, this is scaled down for better fit. |
| `images`          | `array`  | An array of image sources (`img1`, `img2`, etc.) to be displayed. Must have at least **4 images** for proper scrolling. |
| `fadeMask`        | `boolean`| If `true`, applies a fade effect on left/right edges using a CSS mask to hint overflow. |
| `showDragHint`    | `boolean`| If `true`, shows a floating `< drag >` prompt that gently shakes to guide the user. |
