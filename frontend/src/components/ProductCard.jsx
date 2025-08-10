import { HeartIcon, ShoppingCartIcon, StarIcon } from '@heroicons/react/24/solid';
import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const products = [
  {
    id: 1,
    name: 'Earthen Bottle',
    href: '#',
    price: '$48',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-01.jpg',
    imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
  },
  {
    id: 2,
    name: 'Nomad Tumbler',
    href: '#',
    price: '$35',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-02.jpg',
    imageAlt: 'Olive drab green insulated bottle with flared screw lid and flat top.',
  },
  {
    id: 3,
    name: 'Focus Paper Refill',
    href: '#',
    price: '$89',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-03.jpg',
    imageAlt: 'Person using a pen to cross a task off a productivity paper card.',
  },
  {
    id: 4,
    name: 'Machined Mechanical Pencil',
    href: '#',
    price: '$35',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-04.jpg',
    imageAlt: 'Hand holding black machined steel mechanical pencil with brass tip and top.',
  },
  {
    id: 5,
    name: 'Focus Card Tray',
    href: '#',
    price: '$64',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-05.jpg',
    imageAlt: 'Paper card sitting upright in walnut card holder on desk.',
  },
  {
    id: 6,
    name: 'Focus Multi-Pack',
    href: '#',
    price: '$39',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-06.jpg',
    imageAlt: 'Stack of 3 small drab green cardboard paper card refill boxes with white text.',
  },
  {
    id: 7,
    name: 'Brass Scissors',
    href: '#',
    price: '$50',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-07.jpg',
    imageAlt: 'Brass scissors with geometric design, black steel finger holes, and included upright brass stand.',
  },
  {
    id: 8,
    name: 'Focus Carry Pouch',
    href: '#',
    price: '$32',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-08.jpg',
    imageAlt: 'Textured gray felt pouch for paper cards with snap button flap and elastic pen holder loop.',
  },
]
export default function ProductCard() {
  useEffect(() => {
  AOS.init({
    duration: 600,
    easing: 'ease-in-out',
    once: true,
  });
}, []);
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="group border border-gray-300 rounded-lg overflow-hidden shadow hover:shadow-lg transition duration-300"
          data-aos="fade-up"
        >
          <div className="relative">
            <img
              src={product.imageSrc}
              alt={product.imageAlt}
              className="w-full h-56 object-cover"
            />

            <div className="absolute top-2 right-2 flex space-x-2">
              <button title="Add to wishlist" className="bg-white/80 rounded-full p-1 hover:bg-white">
                <HeartIcon className="h-5 w-5 text-gray-600 hover:text-red-500 transition" />
              </button>
              <button title="Add to cart" className="bg-white/80 rounded-full p-1 hover:bg-white">
                <ShoppingCartIcon className="h-5 w-5 text-gray-600 hover:text-green-500 transition" />
              </button>
            </div>
          </div>

          <div className="p-3">
            <div className="flex items-center justify-between">
              <Link to={`/product-details/${product.id}`}>
                <h3 className="text-sm font-medium text-gray-800">{product.name}</h3>
              </Link>
              <p className="text-sm font-semibold text-[var(--primary-color)]">{product.price}</p>
            </div>

            <div className="mt-1 flex items-center">
              {Array(5)
                .fill()
                .map((_, i) => (
                  <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}