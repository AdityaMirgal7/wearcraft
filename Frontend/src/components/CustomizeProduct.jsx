import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CustomizeProduct.css';

const CustomizeProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [textInput, setTextInput] = useState('');
  const [textElements, setTextElements] = useState({ front: [], back: [] });
  const [selectedFont, setSelectedFont] = useState('Montserrat');
  const [textColor, setTextColor] = useState('#000000');
  const [textSize, setTextSize] = useState(24);
  const [textStyle, setTextStyle] = useState({
    bold: false,
    italic: false,
    underline: false,
    shadow: false,
    outline: false
  });
  const [textRotation, setTextRotation] = useState(0);
  const [customImage, setCustomImage] = useState({ front: null, back: null });
  const [imagePosition, setImagePosition] = useState({ front: { x: 50, y: 50 }, back: { x: 50, y: 50 } });
  const [imageScale, setImageScale] = useState({ front: 100, back: 100 });
  const [imageRotation, setImageRotation] = useState({ front: 0, back: 0 });
  const [imageOpacity, setImageOpacity] = useState({ front: 100, back: 100 });
  const [activeElement, setActiveElement] = useState(null);
  const [activeElementType, setActiveElementType] = useState(null);
  const [currentSide, setCurrentSide] = useState('front');
  const fileInputRef = useRef(null);

  const fonts = [
    // Modern Sans-Serif
    'Montserrat',
    'Roboto',
    'Open Sans',
    'Lato',
    'Poppins',
    'Inter',
    'Nunito',
    'Work Sans',
    'Source Sans Pro',
    'DM Sans',
    
    // Elegant Serif
    'Playfair Display',
    'Merriweather',
    'Cormorant',
    'Libre Baskerville',
    'Lora',
    'Crimson Text',
    'Source Serif Pro',
    'PT Serif',
    
    // Display & Headings
    'Oswald',
    'Raleway',
    'Quicksand',
    'Bebas Neue',
    'Anton',
    'Teko',
    'Bungee',
    
    // Handwriting & Script
    'Dancing Script',
    'Great Vibes',
    'Pacifico',
    'Satisfy',
    'Lobster',
    'Caveat',
    'Shadows Into Light',
    'Sacramento',
    'Parisienne',
    
    // Monospace
    'Roboto Mono',
    'Source Code Pro',
    'Fira Code',
    'Space Mono',
    'IBM Plex Mono',
    
    // System Fallbacks
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Verdana'
  ];
  
  const product = location.state?.product;

  if (!product) {
    return <div className="error-message">No product selected</div>;
  }

  const getProductImage = () => {
    if (currentSide === 'front') {
      return product.image;
    } else {
      return product.backImage || product.image;
    }
  };

  const handleAddText = () => {
    if (textInput.trim()) {
      const newTextElement = {
        id: Date.now(),
        text: textInput,
        position: { x: 50, y: 50 },
        font: selectedFont,
        color: textColor,
        size: textSize,
        style: { ...textStyle },
        rotation: textRotation
      };
      setTextElements(prev => ({
        ...prev,
        [currentSide]: [...prev[currentSide], newTextElement]
      }));
      setTextInput('');
      setActiveElement(newTextElement.id);
      setActiveElementType('text');
    }
  };

  const handleTextClick = (id) => {
    setActiveElement(id);
    setActiveElementType('text');
    const element = textElements[currentSide].find(el => el.id === id);
    if (element) {
      setSelectedFont(element.font);
      setTextColor(element.color);
      setTextSize(element.size);
      setTextStyle(element.style);
      setTextRotation(element.rotation);
    }
  };

  const handleImageClick = () => {
    setActiveElement('image');
    setActiveElementType('image');
  };

  const compressImage = (base64String) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64String;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          // First set the uncompressed image to show it immediately
          setCustomImage(prev => ({
            ...prev,
            [currentSide]: e.target.result
          }));
          
          // Initialize scale, rotation, position, and opacity for the new image
          setImageScale(prev => ({
            ...prev,
            [currentSide]: 100
          }));
          setImageRotation(prev => ({
            ...prev,
            [currentSide]: 0
          }));
          setImagePosition(prev => ({
            ...prev,
            [currentSide]: { x: 50, y: 50 }
          }));
          setImageOpacity(prev => ({
            ...prev,
            [currentSide]: 100
          }));
          setActiveElement('image');
          setActiveElementType('image');

          // Then compress the image in the background
          const compressedImage = await compressImage(e.target.result);
          setCustomImage(prev => ({
            ...prev,
            [currentSide]: compressedImage
          }));
        } catch (error) {
          console.error('Error processing image:', error);
          alert('Error processing image. Please try a different image.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const updateActiveElement = () => {
    if (activeElementType === 'text' && activeElement) {
      setTextElements(prev => ({
        ...prev,
        [currentSide]: prev[currentSide].map(el => 
          el.id === activeElement 
            ? {
                ...el,
                font: selectedFont,
                color: textColor,
                size: textSize,
                style: { ...textStyle },
                rotation: textRotation
              }
            : el
        )
      }));
    }
  };

  useEffect(() => {
    updateActiveElement();
  }, [selectedFont, textColor, textSize, textStyle, textRotation]);

  const handleSave = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    
    if (!user || !token) {
      alert("Please log in to save your design.");
      return;
    }

    try {
      // Compress images before sending
      const compressedFrontImage = customImage.front ? await compressImage(customImage.front) : null;
      const compressedBackImage = customImage.back ? await compressImage(customImage.back) : null;

      const designData = {
        productId: product._id,
        design: {
          front: {
            texts: textElements.front,
            image: compressedFrontImage,
            scale: Number(imageScale.front),
            rotation: Number(imageRotation.front),
            position: {
              x: Number(imagePosition.front.x),
              y: Number(imagePosition.front.y)
            },
            opacity: Number(imageOpacity.front)
          },
          back: {
            texts: textElements.back,
            image: compressedBackImage,
            scale: Number(imageScale.back),
            rotation: Number(imageRotation.back),
            position: {
              x: Number(imagePosition.back.x),
              y: Number(imagePosition.back.y)
            },
            opacity: Number(imageOpacity.back)
          },
        },
        timestamp: new Date().toISOString(),
      };

      const response = await fetch('http://localhost:5000/api/designs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(designData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save design');
      }

      const data = await response.json();
      alert('Design saved successfully!');
      navigate('/products');
    } catch (error) {
      console.error('Error saving design:', error);
      alert(error.message || 'Error saving design. Please try again.');
    }
  };

  const getImageStyle = () => {
    return {
      position: 'absolute',
      top: `${imagePosition[currentSide].y}%`,
      left: `${imagePosition[currentSide].x}%`,
      transform: `translate(-50%, -50%) scale(${imageScale[currentSide] / 100}) rotate(${imageRotation[currentSide]}deg)`,
      width: 'auto',
      height: 'auto',
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
      opacity: imageOpacity[currentSide] / 100
    };
  };

  const getTextStyle = (element) => {
    return {
      position: 'absolute',
      left: `${element.position.x}%`,
      top: `${element.position.y}%`,
      transform: `translate(-50%, -50%) rotate(${element.rotation}deg)`,
      color: element.color,
      fontSize: `${element.size}px`,
      fontFamily: element.font,
      fontWeight: element.style.bold ? 'bold' : 'normal',
      fontStyle: element.style.italic ? 'italic' : 'normal',
      textDecoration: element.style.underline ? 'underline' : 'none',
      textShadow: element.style.shadow ? '2px 2px 4px rgba(0,0,0,0.3)' : 'none',
      WebkitTextStroke: element.style.outline ? '1px black' : 'none',
      whiteSpace: 'nowrap'
    };
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddText();
    }
  };

  const toggleSide = () => {
    setCurrentSide(prev => prev === 'front' ? 'back' : 'front');
    setActiveElement(null);
    setActiveElementType(null);
  };
  

  const handleDeleteElement = () => {
  if (!activeElement) return;

  if (activeElementType === 'text') {
    setTextElements(prev => ({
      ...prev,
      [currentSide]: prev[currentSide].filter(el => el.id !== activeElement)
    }));
  } else if (activeElementType === 'image') {
    setCustomImage(prev => ({ ...prev, [currentSide]: null }));
    setImagePosition(prev => ({ ...prev, [currentSide]: { x: 50, y: 50 } }));
    setImageScale(prev => ({ ...prev, [currentSide]: 100 }));
    setImageRotation(prev => ({ ...prev, [currentSide]: 0 }));
    setImageOpacity(prev => ({ ...prev, [currentSide]: 100 }));
  }

  setActiveElement(null);
  setActiveElementType(null);
};


  return (
    <div className="customize-page">
      <div className="customize-container">
        <div className="preview-section">
          <div className="product-preview" data-side={currentSide}>
            <img 
              src={getProductImage()} 
              alt={`${product.name} ${currentSide} view`} 
              className="base-product"
            />
            {customImage[currentSide] && (
              <img
                src={customImage[currentSide]}
                alt="Custom design"
                className={`custom-image ${activeElement === 'image' ? 'active' : ''}`}
                style={getImageStyle()}
                onClick={handleImageClick}
              />
            )}
            {textElements[currentSide].map((element) => (
              <div
                key={element.id}
                className={`custom-text ${activeElement === element.id ? 'active' : ''}`}
                style={getTextStyle(element)}
                onClick={() => handleTextClick(element.id)}
              >
                {element.text}
              </div>
            ))}
          </div>
          <button 
            className="toggle-side-btn"
            onClick={toggleSide}
          >
            {currentSide === 'front' ? 'Switch to Back' : 'Switch to Front'}
          </button>
        </div>

        <div className="customization-options">
          <h2>Customize Your {product.name}</h2>
          <div className="side-indicator">
            Currently editing: <span className="side-name">{currentSide === 'front' ? 'Front' : 'Back'}</span>
          </div>
          
          <div className="option-group">
            <h3>Add Text</h3>
            <p className="instruction-text">
              Type your text and press Enter or click Add Text. Click on any text in the preview to edit it.
            </p>
            <div className="text-input-group">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your text here..."
                className="text-input"
              />
              <button 
                onClick={handleAddText}
                className="add-text-btn"
                disabled={!textInput.trim()}
              >
                Add Text
              </button>
            </div>
            {(activeElementType === 'text' || !activeElement) && (
              <>
                <div className="text-controls">
                  <div className="control-item">
                    <label className="control-label">Font Style</label>
                    <select
                      value={selectedFont}
                      onChange={(e) => setSelectedFont(e.target.value)}
                      className="font-select"
                    >
                      {fonts.map(font => (
                        <option key={font} value={font} style={{ fontFamily: font }}>
                          {font}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="control-item">
                    <label className="control-label">Text Color</label>
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="color-picker"
                    />
                  </div>
                  <div className="control-item">
                    <label className="control-label">Text Size</label>
                    <input
                      type="range"
                      min="12"
                      max="72"
                      value={textSize}
                      onChange={(e) => setTextSize(e.target.value)}
                      className="size-slider"
                    />
                    <span className="control-description">Drag to adjust size</span>
                  </div>
                </div>
                <div className="text-style-controls">
                  <button
                    className={`style-btn ${textStyle.bold ? 'active' : ''}`}
                    onClick={() => setTextStyle(prev => ({ ...prev, bold: !prev.bold }))}
                  >
                    Bold
                  </button>
                  <button
                    className={`style-btn ${textStyle.italic ? 'active' : ''}`}
                    onClick={() => setTextStyle(prev => ({ ...prev, italic: !prev.italic }))}
                  >
                    Italic
                  </button>
                  <button
                    className={`style-btn ${textStyle.underline ? 'active' : ''}`}
                    onClick={() => setTextStyle(prev => ({ ...prev, underline: !prev.underline }))}
                  >
                    Underline
                  </button>
                  <button
                    className={`style-btn ${textStyle.shadow ? 'active' : ''}`}
                    onClick={() => setTextStyle(prev => ({ ...prev, shadow: !prev.shadow }))}
                  >
                    Shadow
                  </button>
                  <button
                    className={`style-btn ${textStyle.outline ? 'active' : ''}`}
                    onClick={() => setTextStyle(prev => ({ ...prev, outline: !prev.outline }))}
                  >
                    Outline
                  </button>
                </div>
                <div className="rotation-control">
                  <label className="control-label">Text Rotation</label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={textRotation}
                    onChange={(e) => setTextRotation(e.target.value)}
                  />
                  <span className="control-description">Rotate text to your desired angle</span>
                </div>
              </>
            )}
          </div>

          <div className="option-group">
            <h3>Add Image</h3>
            <p className="instruction-text">
              Upload your own image or logo. Click on the image in the preview to edit it.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="file-input"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="upload-btn"
            >
              Upload Image
            </button>
            {customImage[currentSide] && activeElementType === 'image' && (
              <div className="image-controls">
                <div className="control-item">
                  <label className="control-label">Image Scale</label>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={imageScale[currentSide]}
                    onChange={(e) => setImageScale(prev => ({
                      ...prev,
                      [currentSide]: Number(e.target.value)
                    }))}
                  />
                  <span className="control-description">Adjust the size of your image</span>
                </div>
                <div className="control-item">
                  <label className="control-label">Image Rotation</label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={imageRotation[currentSide]}
                    onChange={(e) => setImageRotation(prev => ({
                      ...prev,
                      [currentSide]: Number(e.target.value)
                    }))}
                  />
                  <span className="control-description">Rotate your image</span>
                </div>
                <div className="control-item">
                  <label className="control-label">Image Opacity</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={imageOpacity[currentSide]}
                    onChange={(e) => setImageOpacity(prev => ({
                      ...prev,
                      [currentSide]: Number(e.target.value)
                    }))}
                  />
                  <span className="control-description">Adjust image transparency</span>
                </div>
                <div className="control-item">
                  <label className="control-label">Horizontal Position</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={imagePosition[currentSide].x}
                    onChange={(e) => setImagePosition(prev => ({
                      ...prev,
                      [currentSide]: { ...prev[currentSide], x: Number(e.target.value) }
                    }))}
                  />
                  <span className="control-description">Move left or right</span>
                </div>
                <div className="control-item">
                  <label className="control-label">Vertical Position</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={imagePosition[currentSide].y}
                    onChange={(e) => setImagePosition(prev => ({
                      ...prev,
                      [currentSide]: { ...prev[currentSide], y: Number(e.target.value) }
                    }))}
                  />
                  <span className="control-description">Move up or down</span>
                </div>
              </div>
            )}
          </div>

          <div className="option-group">
            <h3>Position</h3>
            <p className="instruction-text">
              Use these controls to fine-tune the position of your selected element.
            </p>
            <div className="position-controls">
              <div className="control-item">
                <label className="control-label">Horizontal Position</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={activeElementType === 'image' ? imagePosition[currentSide].x : (textElements[currentSide].find(el => el.id === activeElement)?.position.x || 50)}
                  onChange={(e) => {
                    if (activeElementType === 'image') {
                      setImagePosition(prev => ({
                        ...prev,
                        [currentSide]: { ...prev[currentSide], x: Number(e.target.value) }
                      }));
                    } else if (activeElementType === 'text') {
                      setTextElements(prev => ({
                        ...prev,
                        [currentSide]: prev[currentSide].map(el => 
                          el.id === activeElement 
                            ? { ...el, position: { ...el.position, x: e.target.value } }
                            : el
                        )
                      }));
                    }
                  }}
                />
                <span className="control-description">Move left or right</span>
              </div>
              <div className="control-item">
                <label className="control-label">Vertical Position</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={activeElementType === 'image' ? imagePosition[currentSide].y : (textElements[currentSide].find(el => el.id === activeElement)?.position.y || 50)}
                  onChange={(e) => {
                    if (activeElementType === 'image') {
                      setImagePosition(prev => ({
                        ...prev,
                        [currentSide]: { ...prev[currentSide], y: Number(e.target.value) }
                      }));
                    } else if (activeElementType === 'text') {
                      setTextElements(prev => ({
                        ...prev,
                        [currentSide]: prev[currentSide].map(el => 
                          el.id === activeElement 
                            ? { ...el, position: { ...el.position, y: e.target.value } }
                            : el
                        )
                      }));
                    }
                  }}
                />
                <span className="control-description">Move up or down</span>
              </div>
            </div>
          </div>
          <button onClick={handleDeleteElement} className="delete-element-btn"
           disabled={!activeElement}
          >
          Delete Selected
          </button>

          <button onClick={handleSave} className="save-design-btn">
            Save Design
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizeProduct; 