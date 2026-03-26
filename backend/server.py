from flask import Flask, request, jsonify, send_from_directory
import qrcode
import os

app = Flask(__name__, static_folder='../frontend')

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_frontend(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return "Not Found", 404

# Placeholder for future API endpoints

@app.route('/generate_qr/<driver_id>')
def generate_qr(driver_id):
    img = qrcode.make(f'https://yourapp.com/driver/{driver_id}')
    img.save(f'static/qr_codes/{driver_id}.png')
    return jsonify({'qr_code_url': f'/static/qr_codes/{driver_id}.png'})

if __name__ == '__main__':
    app.run(debug=True, port=3005)
