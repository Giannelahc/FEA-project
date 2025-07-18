import React, { useRef } from 'react';

function ProductPage() {
    const outputRef = useRef(null);
    const getProducts = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            const response = await fetch('http://localhost:8080/apiman-gateway/default/list-products/1.0?apikey=73363200-f84e-4100-848c-6e3127b9f58c', {
                method: 'GET',
                headers: {
                Authorization: `Bearer ${
                token
                }`,
            },
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const result = await response.json();

            // opential：save token to localstorage or context
            if (outputRef.current) {
                outputRef.current.innerHTML = result.map((p) => `<li>${JSON.stringify(p)}</li>`).join("");
            }

        } catch (error) {
            alert('Login failed: ' + error.message);
            console.log(error.message)
        }
    };
    return (
        <div>
            <button onClick={getProducts}>Get products</button>
            <ul ref={outputRef}>
                {/* Aquí se renderizan los productos */}
            </ul>
        </div>
    );
}

export default ProductPage;
