import React from 'react';

const BottomImage = () => {
    const imageUrl = "./blockchain.png"

    // Render the image as background image with specified css
    return (
        <div className='containerStyle'>
            <div className='blackBackgroundStyle'></div>
            <img src={imageUrl} alt="Bottom Image" className='imageStyle' />
        </div>
    );
};

export default BottomImage;
