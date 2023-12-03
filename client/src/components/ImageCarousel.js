

export default function ImageCarousel({ imageData }) {
  const lastIndex = imageData.length - 1;
  const idTemplate = "#carousel-image-";

  console.log("lastIndex: ", lastIndex);
  console.log("idTemplate: ", idTemplate + lastIndex);

  const images = imageData.map((image, index) => {
    return (
      <div id={idTemplate + index} className="carousel-item relative w-full" key={idTemplate + index}>
        <img src={`data:image/jpeg;base64,${image}`}
          className="w-full"
          style={{
            width: "100%",
            height: "300px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
        {/* <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
          <a href={idTemplate + ( index === 0 ? lastIndex : (index - 1))} className="btn btn-circle">❮</a>
          <a href={idTemplate + ( index === lastIndex ? 0 : (index + 1))} className="btn btn-circle">❯</a>
        </div> */}
      </div>
    );
  });

  return (<div className="carousel rounded-box carousel-end max-h-64">{images}</div>);
}