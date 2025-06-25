import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

export default function ReviewForm({ restaurantId, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    if (!user) {
      toast.error('Please log in to submit a review');
      return;
    }

    if (!rating) {
      setErrors(prev => ({ ...prev, rating: 'Please select a rating' }));
      return;
    }
    if (!comment.trim()) {
      setErrors(prev => ({ ...prev, comment: 'Please enter a comment' }));
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        restaurantId,
        rating,
        comment: comment.trim(),
      });
      setRating(0);
      setComment('');
      toast.success('Review submitted successfully!');
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        toast.error(error.message || 'Failed to submit review');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg border mb-6">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-3">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
        </div>
        <div>
          <h3 className="text-lg font-medium">Write a Review</h3>
          <p className="text-sm text-gray-500">
            {user?.name ? `Reviewing as ${user.name}` : 'Reviewing as Anonymous'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center mb-4">
        <span className="text-gray-700 mr-2">Rating:</span>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <button
              key={i}
              type="button"
              className="focus:outline-none"
              onClick={() => setRating(i + 1)}
              onMouseEnter={() => setHoveredRating(i + 1)}
              onMouseLeave={() => setHoveredRating(0)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 ${
                  i < (hoveredRating || rating)
                    ? 'text-amber-400'
                    : 'text-gray-300'
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
        {errors.rating && <p className="text-red-500 text-sm ml-2">{errors.rating}</p>}
      </div>

      <div className="mb-4">
        <Textarea
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className={`min-h-[100px] ${errors.comment ? 'border-red-500' : ''}`}
        />
        {errors.comment && <p className="text-red-500 text-sm mt-1">{errors.comment}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
} 