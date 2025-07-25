
const img1 = "https://i.postimg.cc/V6Yp5hb1/compressed-1.jpg";
const img2 = "https://i.postimg.cc/wv0PNkhN/compressed-2.jpg";
const img3 = "https://i.postimg.cc/jq3mdZq0/compressed-3.jpg";
const img4 = "https://i.postimg.cc/6qqPfG0m/compressed-4.jpg";
const img5 = "https://i.postimg.cc/XqPzH717/compressed-5.jpg";
const img6 = "https://i.postimg.cc/WbQy0zJ5/compressed-6.jpg";
const img7 = "https://i.postimg.cc/jdW9WPCW/compressed-7.jpg";
const img8 = "https://i.postimg.cc/jSPFcTHt/compressed-8.jpg";

import DragSlider from "./DragSlider";


function App() {
return(
  <div className="w-screen h-screen flex flex-col justify-center items-center">
    <div className="mb-6">
       <h1 className=" text-3xl lg:text-8xl font-semibold text-white">DRAG SLIDER</h1>
    </div>

 

  <div className="">
   <DragSlider
  containerWidth="80"
  imgWidth="48"
  containerHeight="50"
  images={[img1, img2, img3, img4, img5, img6, img7, img8]}
  fadeMask={true} 
  showDragHint={true}/>
  </div>


  </div>
 
);
}

export default App
