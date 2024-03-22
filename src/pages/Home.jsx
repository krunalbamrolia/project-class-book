import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BaseUrl } from '../Constant';

const ProductList = () => {
    let name = useRef();
    let price = useRef();
    let Author = useRef();
    let description = useRef();
    
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('price');
    const [update, setUpdate] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        axios.get('http://localhost:3001/Books')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    };

    const addProduct = async () => {
        let obj = {
            name: name.current.value,
            price: price.current.value,
            Author: Author.current.value,
            description: description.current.value,
        };

        let result = await axios.post(BaseUrl, obj);
        setProducts([...products, result.data]);
    };

    const deleteProduct = async (id) => {
        await axios.delete(BaseUrl + `/${id}`);
        setProducts(products.filter(product => product.id !== id));
    };

    const viewData = (id) => {
        const user = products.find(product => product.id === id);
        setUpdate(user);
    };

    const updateHandler = (e) => {
        setUpdate({ ...update, [e.target.name]: e.target.value });
    };

    const updateProduct = async () => {
        await axios.put(BaseUrl + `/${update.id}`, update);
        setProducts(products.map(product => (product.id === update.id ? update : product)));
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const sortedProducts = [...products].sort((a, b) => {
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        }
        return 0;
    });

    const filteredProducts = sortedProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="product-list-container">
            <div className='inputfields row col-12 mb-5'>
                <div className="card col-6">
                    <div className="card-body">
                        <h1>Add products</h1>
                        <input type="text" placeholder='Book Name' ref={name} />
                        <input type="text" placeholder='Author Name' ref={Author} />
                        <input type="text" placeholder='Description' ref={description} />
                        <input type="text" placeholder='Price' ref={price} />
                        <button className='btn btn-info' onClick={addProduct}>Add</button>
                    </div>
                </div>
                <div className="card col-6">
                    <div className="card-body">
                        <h1>Product Dashboard</h1>
                        <input
                            type="text"
                            placeholder="Search by name or price..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
            </div>
            <table className="table table-bordered text-center">
                <thead>
                    <tr>
                        <th scope="col">Book Name</th>
                        <th scope="col">Author Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Price</th>
                        <th scope="col">Update</th>
                        <th scope="col">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map(product => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.Author}</td>
                            <td>{product.description}</td>
                            <td>${product.price}</td>
                            <td>
                                <button className='btn btn-primary' data-toggle="modal" data-target="#exampleModal" onClick={() => viewData(product.id)}>Edit</button>
                            </td>
                            <td>
                                <button className='btn btn-outline-danger' onClick={() => deleteProduct(product.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <input type="text" value={update.name} placeholder='Product Name' name='name' onChange={updateHandler} />
                            <input type="text" value={update.Author} placeholder='Author' name='Author' onChange={updateHandler} />
                            <input type="text" value={update.description} placeholder='description' name='description' onChange={updateHandler} />
                            <input type="text" value={update.price} placeholder='Price' name='price' onChange={updateHandler} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={updateProduct}>Update</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductList;