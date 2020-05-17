import React, { PureComponent } from 'react';
import DropzoneComponent from 'react-dropzone-component';

const djsConfig = {
  acceptedFiles: "image/jpeg,image/png,image/gif",
  autoProcessQueue: false,
  uploadMultiple: true,
  addRemoveLinks: true
}

const componentConfig = {
  iconFiletypes: ['.jpg', '.png', '.gif'],
  showFiletypeIcon: false,
  maxFiles: 10,
  postUrl: 'no-url'
}

export default class ImageDropzone extends PureComponent {
    state = {
        addedImages: []
    }

  showPreview = image => {
    if(image == null) return;

    let mockFile = {
      name: image.name,
      size: image.byte_size,
      dataURL: image.url,
    };

    this.myDropzone.files.push(mockFile);
    this.myDropzone.emit("addedfile", mockFile);
    this.myDropzone.createThumbnailFromUrl(
      mockFile,
      this.myDropzone.options.thumbnailWidth,
      this.myDropzone.options.thumbnailHeight,
      this.myDropzone.options.thumbnailMethod,
      true,
      thumbnail => {
        this.myDropzone.emit('thumbnail', mockFile, thumbnail);
        this.myDropzone.emit("complete", mockFile);
      }
    );
  }

  addNew = (img) => {
      this.setState(prev => {
          return {
          addedImages: [...prev.addedImages, img]
          }
      })
  }

  removeImage = (img) => {
    this.setState(prev => {
        return {
        addedImages: [...prev.addedImages.filter(file => file !== img)]
        }
    })
}

  render() {
    const { image } = this.props;
    const eventHandlers = {
      init: dropzone => {
        this.myDropzone = dropzone;
        this.showPreview(image);
        this.setState({
            addedImages: dropzone.files
        })
      },
      addedfile: image => this.addNew(image),
      removedfile: (image) => this.removeImage(image)
    }

    return (
      <DropzoneComponent
        config={componentConfig}
        eventHandlers={eventHandlers}
        djsConfig={djsConfig}
      />
    );
  }
}

// ImageDropzone.propTypes = {
//   image: PropTypes.shape({
//     name: PropTypes.string,
//     byte_size: PropTypes.integer,
//     url: PropTypes.string
//   })
// }
