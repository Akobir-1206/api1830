import React, { useEffect, useState, useRef } from 'react';
import './Home.css';
import { toast } from 'react-toastify';

export default function Home() {
  // Category GET
  const [categ, setCateg] = useState([]);

  function getCategory() {
    fetch('https://autoapi.dezinfeksiyatashkent.uz/api/categories')
      .then((res) => res.json())
      .then((element) => setCateg(element?.data));
  }

  useEffect(() => {
    getCategory();
  }, []);

  // Modal function
  const [openModal, setOpenModal] = useState(false);
  const [editOpenModal, setEditModal] = useState(false);
  
  const modalRef = useRef(null); // Reference for the modal element

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setOpenModal(false);
        setEditModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Category POST
  const [nameEn, setNameEn] = useState("");
  const [nameRu, setNameRu] = useState("");
  const [image, setImage] = useState(null);
  const tokenxon = localStorage.getItem('tokenchik');

  const categoryPost = (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append('name_en', nameEn);
    formdata.append('name_ru', nameRu);
    formdata.append('images', image);

    fetch('https://autoapi.dezinfeksiyatashkent.uz/api/categories', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenxon}`, 
      },
      body: formdata,
    })
      .then((response) => response.json())
      .then((elem) => {
        if (elem?.success) {
          getCategory();
          toast.success(elem?.message);
          setOpenModal(false);
        } else {
          toast.error(elem?.message);
        }
      })
      .catch((err) => {
        toast.error('Server xatosi yuz berdi!');
      });
  };

  // DELETE API
  const deleteApi = (id) => {
    fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/categories/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${tokenxon}`,
      },
    })
      .then((resp) => resp.json())
      .then((items) => {
        if (items?.success) {
          toast.success(items?.message);
          getCategory();
        } else {
          toast.error(items?.message);
        }
      });
  };
  const [idClick, setIdClick] = useState();

  // PUT API ozgartirish 
  const modaOpenFunction = (id) => {
    setEditModal(!editOpenModal);
    setOpenModal(false);
    setIdClick(id);
  };
  
  const modaOpenFunctionAdd = () => {
    setEditModal(false);
    setOpenModal(!openModal);
  };

 //////////////
 const selectedData = categ?.find((eleme)=> eleme?.id ===idClick)
  
  // EDIT function
  const editFunction = (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append('name_en', nameEn);
    formdata.append('name_ru', nameRu);
    formdata.append('images', image);

    fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/categories/${idClick}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${tokenxon}`,
      },
      body: formdata,
    })
      .then((responses) => responses.json())
      .then((item) => {
        if (item?.success) {
          getCategory();
          toast.success(item?.message);
          setEditModal(false);
          setIdClick();
        } else {
          toast.error(item?.message);
        }
      })
      .catch((err) => {
        toast.error('Server xatosi yuz berdi!');
      });
  };

  return (
    <div>
      <button onClick={modaOpenFunctionAdd}>
        {openModal ? 'Yopish' : 'Qoshish'}
      </button>
      
      {openModal && (
        <div className="modal" ref={modalRef}>
          <h1>Add</h1>
          <form onSubmit={categoryPost}>
            <input
              onChange={(e) => setNameEn(e?.target?.value)}
              type="text"
              placeholder="Name EN"
              required
            />
            <input
              onChange={(e) => setNameRu(e?.target?.value)}
              type="text"
              placeholder="Name RU"
              required
            />
            <input
              onChange={(e) => setImage(e?.target?.files[0])}
              type="file"
              required
            />
            <button type="submit">Qo'shilsin</button>
          </form>
        </div>
      )}
      
      {editOpenModal && (
        <div className="modal" ref={modalRef}>
          <h1>Edit</h1>
          <form onSubmit={editFunction}>
            <input defaultValue={selectedData?.name_en}
              onChange={(e) => setNameEn(e?.target?.value)}
              type="text"
              placeholder="Name EN"
              required
            />
            <input defaultValue={selectedData?.name_ru}
              onChange={(e) => setNameRu(e?.target?.value)}
              type="text"
              placeholder="Name RU"
              required
            />
            <input
              onChange={(e) => setImage(e?.target?.files[0])}
              type="file"
              required
            />
            <button type="submit">Edit</button>
          </form>
        </div>
      )}

      <table id="customers">
        <thead>
          <tr>
            <th>Name EN</th>
            <th>Name RU</th>
            <th>Image</th>
            <th>Delete</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {categ?.map((item, index) => (
            <tr key={index}>
              <td>{item?.name_en}</td>
              <td>{item?.name_ru}</td>
              <td>
                <img
                  src={`https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/${item?.image_src}`}
                  alt={item?.name_en}
                  style={{ width: '100px' }}
                />
              </td>
              <td><button onClick={() => deleteApi(item?.id)}>ochirish</button></td>
              <td><button onClick={() => modaOpenFunction(item?.id)}>tahrirlash</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
