import React, { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, addDoc, getDocs, query, doc, deleteDoc, onSnapshot, updateDoc } from 'firebase/firestore'

const FornInPutData = () => {
    const [data, setData] = useState([])
    const [form, setform] = useState({})
    const [editId, setEditId] = useState(null)

    const dataRef = collection(db, 'DataPrice');
    useEffect(() => {

        const unsubscribe = loadRealTime()
        return () => {
            unsubscribe();

        }

    }, [])

    const loadRealTime = () => {

        const unsubscribe = onSnapshot(dataRef, (snapshot) => {
            const newData = snapshot.docs.map((doc) => ({

                id: doc.id,
                ...doc.data()

            }));
            setData(newData);

        })

        return () => {
            unsubscribe();
        }

    }




    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(dataRef, id))

        } catch (err) {
            console.log(err)
        }
    };




    const handleChange = (e) => {

        setform({
            ...form,
            [e.target.name]: e.target.value,

        })
    }
    const handleAddData = async () => {
        await addDoc(dataRef, form)
            .then((res) => {
                // รีเฟรชเพจหลังจากเพิ่มข้อมูลสำเร็จ
                window.location.reload();
            })
            .catch(err => console.log(err));
    };


    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const sortData = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        const sortedData = [...data].sort((a, b) => {
            if (a[key].toLowerCase() < b[key].toLowerCase()) {
                return direction === 'asc' ? -1 : 1;
            }
            if (a[key].toLowerCase() > b[key].toLowerCase()) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        setData(sortedData);
        setSortConfig({ key, direction });
    };
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };


    const [showInput, setShowInput] = useState(false);
    const [showAddBtn, setShowAddBtn] = useState(false);
    const handleShowInput = () => {
        setShowInput(true); // เปลี่ยน state ให้เป็น true เพื่อแสดง inputdata
        setShowAddBtn(true);
    };
    const handleHideInput = () => {
        setShowInput(false); // เปลี่ยน state ให้เป็น true เพื่อแสดง inputdata
        setShowAddBtn(false);
    };


    const handleSave = async (id) => {
        try {
            await updateDoc(doc(dataRef, id), form);
            setEditId(null)

        } catch (err) {
            console.log(err)
        }
    }
    const handleCancle = () => {
        setEditId(null)
        setform({})
    }

    const [selectedItem, setSelectedItem] = useState(null);
    const handleCardClick = (item) => {
        setSelectedItem(item);  // เมื่อคลิกการ์ด เก็บข้อมูล item ใน state
    };

    const [searchTerm, setSearchTerm] = useState('');
    // ฟังก์ชันในการจัดการการเปลี่ยนแปลงคำค้นหา
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    // ฟังก์ชันสำหรับการกรองข้อมูลตามคำค้นหา
    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );



    return (
        <div className="container">
            <h1 className='text-center'>ITEM PRICE</h1>
            <div className='formtable'>

                <button className={`btn-add ${showAddBtn ? "hide" : "show"}`} onClick={handleShowInput}>Add Data</button>



                {/* ถ้า showInput เป็น true, จะแสดง div นี้ */}
                <div className={`inputdata ${showInput ? "show" : "hide"}`}>
                    <div className="title-head">Add Data</div>

                    <div className="input-grid">
                        <label htmlFor="">Name</label> <input onChange={(e) => handleChange(e)} type='text' name='name' placeholder='Name' /> <br />
                    </div>
                    <div className="input-grid">
                        <label htmlFor="">Percent</label><input onChange={(e) => handleChange(e)} type='number' name='detail' placeholder='Percent' /><br />
                    </div>
                    <div className="input-grid">
                        <label htmlFor="">Price</label><input onChange={(e) => handleChange(e)} type='number' name='price' placeholder='Price' /><br />
                    </div>
                    <div className="btn-grid">
                        <button className='btn-addData' onClick={handleAddData}>Add Data</button>
                        <button className={`btn-add-cancle ${showAddBtn ? "show" : "hide"}`} onClick={handleHideInput}>Cancle</button>
                    </div>
                </div>

                <hr />
                <div className="serch-box">
                    <input
                        type="text"
                        placeholder='ค้นหา'
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="box-table">
                    <table className="table table-hover price-table">
                        <thead>
                            <tr>
                                <th className='tb-no' scope="col">No.</th>
                                <th className='tb-name' onClick={() => sortData('name')}>Name</th>
                                <th className='tb-detail' scope="col">Percent</th>
                                <th className='tb-price' scope="col">Price</th>
                                <th className='tb-price' scope="col">100% Price</th>
                                <th className='tb-edit' scope="col">Edit</th>

                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, index) =>
                                <tr key={index}>
                                    <th className='tb-no' scope="row">{index + 1}</th>

                                    <td className='tb-name'>
                                        {editId === item.id
                                            ? (
                                                <input
                                                    onChange={handleChange}
                                                    type='text'
                                                    name='name'
                                                    value={form.name !== undefined ? form.name : item.name}
                                                    placeholder='Name'
                                                />
                                            )
                                            : item.name
                                        }
                                    </td>

                                    <td className='tb-detail'>
                                        {editId === item.id
                                            ? (
                                                <input
                                                    onChange={handleChange}
                                                    type='text'
                                                    name='percent'
                                                    value={form.detail !== undefined ? form.detail : item.detail}
                                                    placeholder='Percent'
                                                />
                                            )
                                            : <div className="text-center">{item.detail} %</div>
                                        }
                                    </td>

                                    <td className='tb-price'>
                                        {editId === item.id
                                            ? (
                                                <input
                                                    onChange={handleChange}
                                                    type='number'
                                                    name='price'
                                                    value={form.price !== undefined ? form.price : item.price}
                                                    placeholder='Price'
                                                />
                                            )
                                            : formatPrice(item.price)
                                        }
                                    </td>

                                    <td className='tb-price'>
                                        {formatPrice((100 / item.detail) * item.price)}
                                    </td>

                                    <td className='tb-btn-grid tb-edit'>
                                        {editId === item.id
                                            ? (
                                                <>
                                                    <button className='btn-editData' onClick={() => handleSave(item.id)}>Save</button>
                                                    <button className='btn-deleteData' onClick={() => handleCancle()}>Cancel</button>
                                                </>
                                            )
                                            : (
                                                <>
                                                    <button className='btn-editData' onClick={() => setEditId(item.id)}>Edit</button>
                                                    <button className='btn-deleteData' onClick={() => handleDelete(item.id)}>Delete</button>
                                                </>
                                            )
                                        }
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                </div>
                <div className="card-grid">
                    {data.map((item, index) => (
                        <div
                            type="button"
                            className="card"
                            key={index}
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                            onClick={() => handleCardClick(item)}  // เมื่อคลิก เรียกฟังก์ชัน handleCardClick
                        >
                            <div className="card-body">
                                <p className="card-text">{item.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* <!-- Modal --> */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">
                                {selectedItem ? selectedItem.name : ''}  {/* แสดงชื่อของ item ที่ถูกเลือก */}
                            </h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {
                                selectedItem
                                    ? (<>
                                        ข้อมูลเพิ่มเติมของ : {selectedItem.name} <br />
                                        เปอร์เซ็นต์ที่บันทึก : {selectedItem.detail}%<br />
                                        ราคา {selectedItem.detail}% : {formatPrice(selectedItem.price)}<br />
                                        ราคา 100% :  {formatPrice((100 / selectedItem.detail) * selectedItem.price)}
                                    </>)

                                    : (<>'...'</>)

                            }

                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default FornInPutData