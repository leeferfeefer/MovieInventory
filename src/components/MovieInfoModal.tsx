import React from 'react';
import MovieInfoCarousel from './MovieInfoCarousel';
import './MovieInfoModal.css';

type MovieInfoModalProps = {
    images: string[];
    onClose: () => void;
};

const MovieInfoModal: React.FC<MovieInfoModalProps> = ({ images, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button
                    className="close-button"
                    onClick={onClose}
                >
                    Close
                </button>
                <MovieInfoCarousel images={images} />
            </div>
        </div>
    );
};

export default MovieInfoModal;
