import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface BarcodeLabelProps {
  product: {
    name: string;
    barcode: string;
    price: number;
    sku: string;
  };
}

export const BarcodeLabel = React.forwardRef<HTMLDivElement, BarcodeLabelProps>(
  ({ product }, ref) => {
    return (
      <div 
        ref={ref} 
        style={{ 
          width: '100%', 
          height: '100%', 
          padding: '20px', 
          backgroundColor: 'white', 
          color: 'black',
          fontFamily: 'sans-serif',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pageBreakAfter: 'always'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Satyabhama</h2>
          <p style={{ margin: '4px 0', fontSize: '12px', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {product.name}
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: '#666', fontFamily: 'monospace' }}>SKU: {product.sku}</p>
        </div>
        
        <div style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' }}>
          <QRCodeSVG 
            value={`http://localhost:3001/card/${product.sku}`} 
            size={100} 
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"M"}
            marginSize={0}
          />
        </div>
        <p style={{ marginTop: '8px', marginBottom: 0, fontSize: '9px', color: '#888', letterSpacing: '1px' }}>SCAN FOR AUTHENTICITY</p>
        
        <div style={{ marginTop: '12px', fontSize: '18px', fontWeight: 'bold' }}>
          ₹{Number(product.price).toLocaleString('en-IN')}
        </div>
      </div>
    );
  }
);

BarcodeLabel.displayName = 'BarcodeLabel';
