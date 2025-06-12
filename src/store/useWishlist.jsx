// useWishlist.ts
import { useState } from 'react';


const useWishlist = () => {
    const [wishlist, setWishlist] = useState([]);

    const addToWishlist = (product) => {
        const newItem = {
            product,
        };
        setWishlist((prevWishlist) => [...prevWishlist, newItem]);
    };

    const removeFromWishlist = (productId) => {
        setWishlist((prevWishlist) =>
            prevWishlist.map(item => ({
                product: item.product.filter(prd => prd.id !== productId)
            }))
        );
    };

    return {
        wishlist,
        addToWishlist,
        removeFromWishlist,
    };
};

export default useWishlist;
