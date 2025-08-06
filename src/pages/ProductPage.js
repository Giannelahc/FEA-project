import React, { useRef } from 'react';
import { authFetch } from '../helper/authFetch';

function ProductPage() {
    const outputRef = useRef(null);

    const getProducts = async (e) => {
        e.preventDefault();

        try {
            const response = await authFetch('http://localhost:8080/apiman-gateway/default/list-products/1.0?apikey=73363200-f84e-4100-848c-6e3127b9f58c');

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const result = await response.json();

            if (outputRef.current) {
                outputRef.current.innerHTML = result.map((p) => `<li>${JSON.stringify(p)}</li>`).join("");
            }

        } catch (error) {
            console.error(error.message);
            window.location.href = '/login';
        }
    };

    return (
        <div>
            <button onClick={getProducts}>Get products</button>
            <ul ref={outputRef}></ul>
        </div>
    );
}

export default ProductPage;
