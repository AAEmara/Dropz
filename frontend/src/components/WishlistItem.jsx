import { useDispatch } from "react-redux";
import { removeFromWishlist } from "../store/slices/wishlist";
import { addToCart } from "../store/slices/cart";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

const WishlistItem = ({ item }) => {
  const dispatch = useDispatch();

  if (!item || !item.product) {
    return (
      <div className="relative w-64 bg-white shadow-md rounded-2xl p-3 flex flex-col items-center">
        <p className="text-red-500">Invalid wishlist item</p>
      </div>
    );
  }

  const handleRemove = () => {
    dispatch(removeFromWishlist(item.product.id));
  };

  const handleAddToCart = () => {
    dispatch(addToCart(item.product.id));
  };

  return (
    <div className="relative bg-white shadow-md rounded-2xl p-3 flex flex-col items-center">
      {/* Remove button */}
      <button
        onClick={handleRemove}
        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full z-10 cursor-pointer"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>

      {/* Clickable product image and title */}
      <Link
        to={`/product-details/${item.product.id}`}
        className="w-full flex flex-col items-center cursor-pointer"
      >
        <div className="w-full aspect-square overflow-hidden rounded-xl">
          <img
            src={item.product.image}
            alt={item.product.title}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="mt-2 text-center font-semibold text-gray-800 line-clamp-2">
          {item.product.title}
        </p>
      </Link>

      {/* Product price */}
      <p className="text-green-600 font-bold mt-1">
        {item.product.price} EGP
      </p>

      {/* Add to Cart button */}
      <div class="mx-6 bg-[#083947] text-white px-6 py-2 rounded-sm cursor-pointer hover:shadow-xl/30"><button         onClick={handleAddToCart}
 class="cursor-pointer">Add to Cart</button></div>
    
    </div>
  );
};

export default WishlistItem;
