import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Slick from 'react-slick';
import { Overlay, Global, Header, SlickWrapper, CloseBtn, ImgWrapper, Indicator } from './styles';

const ImagesZoom = ({images, onClose}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    return (
        <Overlay>
            <Global />
            <Header>
                <h1>상세 이미지</h1>
                <CloseBtn onClick={onClose}>X</CloseBtn>
            </Header>
            <SlickWrapper>
                <div>
                    <Slick
                        initialSlide={0}
                        beforeChange={(slide) => setCurrentSlide(slide)}
                        infinite
                        arrows={false}
                        slidesToShow={1}
                        slidesToScroll={1}
                    >
                        {images.map((v) => ( // slick에 넣을 이미지를 각각 넣어준다.
                            <ImgWrapper key={v.src}>
                                <img src={v.src} alt={v.src} />
                            </ImgWrapper>
                        ))}
                    </Slick>
                    <Indicator>
                        {currentSlide + 1 /* 몇번째 슬라이드를 보고 있는지 확인용 */}
                        {' '}
                        /
                        {images.length}
                    </Indicator>
                </div>
            </SlickWrapper>
        </Overlay>
    );
}

ImagesZoom.propTypes = {
    images: PropTypes.arrayOf(PropTypes.object).isRequired,
    onClose: PropTypes.func.isRequired,
}

export default ImagesZoom;
