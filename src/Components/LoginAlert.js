import React, { useState } from 'react';
import SweetAlert2 from 'react-sweetalert2';

export default function LoginAlert(){
    const [swalProps, setSwalProps] = useState({});
    return (
        <div>
            <button onClick={() => {
                setSwalProps({
                    show: true,
                    title: 'Basic Usage',
                    text: 'Hello World',
                });
            }}>
                Open
            </button>

            <SweetAlert2 {...swalProps} />
        </div>
    );
}