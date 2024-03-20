import React, { useRef, useEffect, useState, Fragment } from "react";
import { Stage, Layer, Image, Transformer } from "react-konva";
import useImage from "use-image";

const imgListing = [
  { id: "img1", src: "https://konvajs.org/assets/lion.png", alt: "lion" },
  { id: "img2", src: "https://konvajs.org/assets/yoda.jpg", alt: "yoda" },
];

const URLImage = ({ image, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  const [img] = useImage(image.src);

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <Fragment>
      <Image
        id={image.id}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        image={img}
        x={image.x}
        y={image.y}
        draggable
        // Offset to set origin to the center of the image
        offsetX={img ? img.width / 2 : 0}
        offsetY={img ? img.height / 2 : 0}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // node.scaleX(1);
          // node.scaleY(1);
          // onChange({
          //   id: image.id,
          //   src: image.src,
          //   x: node.x(),
          //   y: node.y(),
          //   width: 1000,
          //   height: Math.max(node.height() * scaleY),
          // });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </Fragment>
  );
};

const App = () => {
  const dragUrl = useRef();
  const stageRef = useRef();
  const [images, setImages] = useState([]);
  const [selectedId, selectShape] = useState(null);

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  return (
    <div>
      <br />
      <div>
        {imgListing.map((item, i) => {
          return (
            <img
              key={i}
              id={item.id}
              src={item.src}
              alt={item.alt}
              draggable="true"
              onDragStart={(e) => {
                dragUrl.current = e.target.src;
              }}
            />
          );
        })}
      </div>
      <br />
      <div
        onDrop={(e) => {
          e.preventDefault();
          // register event position
          stageRef.current.setPointersPositions(e);
          // add image
          setImages(
            images.concat([
              {
                ...stageRef.current.getPointerPosition(),
                id: Math.floor(100000 + Math.random() * 900000),
                src: dragUrl.current,
              },
            ])
          );
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        <Stage
          width={window.innerWidth - 2}
          height={window.innerHeight - 300}
          style={{ border: "1px solid grey" }}
          onMouseDown={checkDeselect}
          onTouchStart={checkDeselect}
          ref={stageRef}
        >
          <Layer>
            {images.map((image, i) => {
              return (
                <URLImage
                  key={i}
                  image={image}
                  isSelected={image.id === selectedId}
                  onSelect={() => {
                    selectShape(image.id);
                  }}
                  onChange={(newAttrs) => {
                    const rects = images.slice();
                    rects[i] = newAttrs;
                    setImages(rects);
                  }}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default App;
