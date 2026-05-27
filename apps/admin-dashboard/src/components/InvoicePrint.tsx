import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface InvoicePrintProps {
  order: any;
}

export const InvoicePrint = React.forwardRef<HTMLDivElement, InvoicePrintProps>(
  ({ order }, ref) => {
    if (!order) return null;

    const total = order.totalAmount || 0;

    return (
      <div 
        ref={ref} 
        style={{ 
          padding: '40px', 
          backgroundColor: 'white', 
          color: 'black',
          fontFamily: 'serif',
          maxWidth: '800px',
          margin: '0 auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #ccc', paddingBottom: '20px', marginBottom: '20px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '2px' }}>Satyabhama</h1>
            <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Luxury Saree Registry</p>
            <p style={{ margin: '10px 0 0 0', fontSize: '14px' }}>123 Heritage Weavers Lane<br/>Bengaluru, Karnataka 560001<br/>GSTIN: 29XXXXX1234X1ZX</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ margin: 0, fontSize: '24px', color: '#333' }}>TAX INVOICE</h2>
            <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Date:</strong> {new Date().toLocaleDateString('en-IN')}</p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Order No:</strong> {order.orderNumber}</p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Payment:</strong> PAID via POS</p>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #ddd' }}>
              <th style={{ padding: '10px', textAlign: 'left', fontSize: '14px' }}>Item Details</th>
              <th style={{ padding: '10px', textAlign: 'center', fontSize: '14px' }}>Qty</th>
              <th style={{ padding: '10px', textAlign: 'right', fontSize: '14px' }}>Rate</th>
              <th style={{ padding: '10px', textAlign: 'right', fontSize: '14px' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item: any, idx: number) => (
              <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px 10px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.product?.name || 'Saree'}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>SKU: {item.product?.sku || 'N/A'}</div>
                </td>
                <td style={{ padding: '15px 10px', textAlign: 'center', fontSize: '14px' }}>{item.quantity}</td>
                <td style={{ padding: '15px 10px', textAlign: 'right', fontSize: '14px' }}>₹{Number(item.price).toLocaleString('en-IN')}</td>
                <td style={{ padding: '15px 10px', textAlign: 'right', fontSize: '14px', fontWeight: 'bold' }}>
                  ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #ccc', paddingTop: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <QRCodeSVG 
              value={`http://localhost:3001/verify-order/${order.orderNumber}`} 
              size={80} 
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"L"}
            />
            <div style={{ fontSize: '10px', color: '#666', marginTop: '5px' }}>Scan for Details</div>
          </div>
          <div style={{ width: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
              <span>Subtotal:</span>
              <span>₹{Number(total).toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
              <span>CGST (2.5%):</span>
              <span>₹{(Number(total) * 0.025).toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
              <span>SGST (2.5%):</span>
              <span>₹{(Number(total) * 0.025).toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #ddd', fontSize: '18px', fontWeight: 'bold' }}>
              <span>Grand Total:</span>
              <span>₹{Number(total).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '40px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
          <p style={{ margin: '0 0 10px 0', fontStyle: 'italic', color: '#444', fontSize: '13px', lineHeight: '1.6' }}>
            "Thank you for inviting a piece of Indian heritage into your wardrobe. At Satyabhama Designers, every weave tells a story of tradition, artistry, and timeless elegance. We hope this saree brings you as much joy as it brought our artisans to weave it."
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: '#888' }}>
            Scan the QR codes on your saree tags for styling tips and care instructions.<br/>
            This is a computer-generated tax invoice.
          </p>
        </div>
      </div>
    );
  }
);

InvoicePrint.displayName = 'InvoicePrint';
