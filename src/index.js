import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Modal from 'react-modal';
import {QRCodeCanvas} from 'qrcode.react';
import Uppy from '@uppy/core';
import Transloadit, { COMPANION_URL, COMPANION_ALLOWED_HOSTS } from '@uppy/transloadit'
import GoogleDrive from "@uppy/google-drive";
import Url from "@uppy/url";
import { Dashboard } from '@uppy/react';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import './style.css'


const uppy = new Uppy()
    .use(Transloadit, {
        waitForEncoding: true,
        alwaysRunAssembly: true,
        params: {
          auth: {
            key: '6763f24daa8e45dca4bdd8aa3fd66742',
          },
          template_id: 'd58c0bfb9ab24ef18e720f79ae687ae4',
        }
    })
    .use(GoogleDrive, {
      companionUrl: COMPANION_URL,
      companionAllowedHosts: COMPANION_ALLOWED_HOSTS
    })
    .use(Url, {
      companionUrl: COMPANION_URL,
      companionAllowedHosts: COMPANION_ALLOWED_HOSTS
    });
const appRoot = document.getElementById("app");
Modal.setAppElement(appRoot);

function Component() {
  const [imgUrls, setImgUrls] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const closeModal = () => {
    setModalOpen(false)
  };

  useEffect(() => {
    uppy.on('transloadit:complete', (assembly) => {
      if (assembly.uploads && assembly.uploads.length > 0) {
        const uploadedUrls = assembly.uploads.map(upload => upload.url);
        setImgUrls(uploadedUrls);
        setModalOpen(true);
      }
    });
  }, []); 

  return (
    <div className="App">
      <Dashboard uppy={uppy} plugins={["GoogleDrive", "Url"]} />
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} >
        <div className="modal-body">
          <span>scan this QR code using your</span>
          <span>phone/tablet to</span>
          <span>get your files</span>
          {imgUrls.length > 0 && (
            <div className="qr">
              {imgUrls.map((url, index) => (
                <React.Fragment key={index}>           
                  <QRCodeCanvas className="mt" id={`qr-${index}`} value={url} />
                  <p >Or type this into your browser:</p>
                  <span>link:<a href={`${url}`} target='_blank'>Click here</a></span>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}

if (appRoot) {
  createRoot(appRoot).render(<Component />);
}