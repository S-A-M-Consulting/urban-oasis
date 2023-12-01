export default function Rating({ rating }) {
  const normalizedRating = Math.round(rating * 2) / 2;

  return generateStars( normalizedRating, true );
}

const generateStars = (index, checked) => {
  const stars = [];
  for (let i = 0; i < 10; i++) {
    const isHalfStar = i % 2 === 1;
    const isChecked = checked && Math.floor(index) === i / 2;

    stars.push(
      <input
        key={i}
        type="radio"
        name="rating-10"
        className={`bg-accent mask mask-star-2 ${isHalfStar ? 'mask-half-2' : 'mask-half-1'}`}
        disabled
        checked={isChecked}
      />
    );
  }

  return <div className="rating rating-md rating-half">{stars}</div>;
};