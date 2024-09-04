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

        await addDoc(dataRef, form).then((res) => {


        }).catch(err => console.log(err))
    }


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
                        <label htmlFor="">Detail</label><input onChange={(e) => handleChange(e)} type='text' name='detail' placeholder='Detail' /><br />
                    </div>
                    <div className="input-grid">
                        <label htmlFor="">Price</label><input onChange={(e) => handleChange(e)} type='text' name='price' placeholder='Price' /><br />
                    </div>
                    <div className="btn-grid">
                        <button className='btn-addData' onClick={handleAddData}>Add Data</button>
                        <button className={`btn-add-cancle ${showAddBtn ? "show" : "hide"}`} onClick={handleHideInput}>Cancle</button>
                    </div>
                </div>

                <hr />
                <div className="box-table">
                    <table className="table table-hover price-table">
                        <thead>
                            <tr>
                                <th className='tb-no' scope="col">No.</th>
                                <th className='tb-name' onClick={() => sortData('name')}>Name</th>
                                <th className='tb-detail' scope="col">Detail</th>
                                <th className='tb-price' scope="col">Price</th>
                                <th className='tb-edit' scope="col">Edit</th>

                            </tr>
                        </thead>
                        <tbody>


                            {data.map((item, index) =>
                                <tr key={index}>
                                    <th className='tb-no' scope="row">{index + 1}</th>


                                    <td className='tb-name'>{editId === item.id
                                        ? (<><input onChange={(e) => handleChange(e)}
                                            type='text'
                                            name='name'
                                            value={form.name !== undefined ? form.name : item.name}
                                            placeholder='Name' /></>)
                                        : (
                                            item.name
                                        )

                                    }</td>


                                    <td className='tb-detail'>{editId === item.id
                                        ? (<><input onChange={(e) => handleChange(e)}
                                            type='text'
                                            name='detail'
                                            value={form.detail !== undefined ? form.detail : item.detail}
                                            placeholder='Detail' /></>)
                                        : (
                                            item.detail
                                        )

                                    }</td>

                                    <td className='tb-price'>{editId === item.id
                                        ? (<><input onChange={(e) => handleChange(e)}
                                            type='number'
                                            name='price'
                                            value={form.price !== undefined ? form.price : item.price}
                                            placeholder='price' /></>)
                                        : (
                                            formatPrice(item.price)
                                        )

                                    }</td>
                                    <td className='tb-btn-grid tb-edit'>
                                        {
                                            editId === item.id
                                                ? (<>
                                                    <button className='btn-editData' onClick={() => handleSave(item.id)}>Save</button>
                                                    <button className='btn-deleteData' onClick={() => handleCancle()}>Cancle</button>
                                                </>)
                                                : (<>
                                                    <button className='btn-editData' onClick={() => setEditId(item.id)}>Edit</button>
                                                    <button className='btn-deleteData' onClick={() => handleDelete(item.id)}>Delete</button>
                                                </>)
                                        }



                                    </td>
                                </tr>

                            )}



                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    )
}

export default FornInPutData