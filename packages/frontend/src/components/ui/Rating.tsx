import React from 'react';

interface RatingProps {
  rate: number;
  count: number;
  maxStars?: number;
}

export const Rating: React.FC<RatingProps> = ({ rate, count, maxStars = 5 }) => {
  const fullStars = Math.floor(rate);
  const halfStar = rate % 1 >= 0.5 ? 1 : 0; // Simple half-star logic
  const emptyStars = maxStars - fullStars - halfStar;

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600">
      <div className="flex items-center">
        {Array(fullStars)
          .fill(0)
          .map((_, i) => (
            <Star key={`full-${i}`} type="full" />
          ))}
        {halfStar === 1 && <Star key="half" type="half" />}
        {Array(emptyStars)
          .fill(0)
          .map((_, i) => (
            <Star key={`empty-${i}`} type="empty" />
          ))}
      </div>
      <span className="text-gray-500">
        ({count} {count === 1 ? 'review' : 'reviews'})
      </span>
    </div>
  );
};

// Simple Star component - can be enhanced with SVGs or an icon library
const Star: React.FC<{ type: 'full' | 'half' | 'empty' }> = ({ type }) => {
  let starCharacter = '☆'; // Default to empty
  if (type === 'full') {
    starCharacter = '★';
  } else if (type === 'half') {
    // For simplicity, a half star could be represented differently or use a specific icon.
    // Here, we'll use a full star for half for now, or you could use a different character or SVG.
    // A more advanced version might use a partially filled SVG.
    starCharacter = '★'; // Or a specific half-star icon/character
  }
  return <span className="text-yellow-500">{starCharacter}</span>;
};
