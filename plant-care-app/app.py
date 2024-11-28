from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Route to serve the main page
@app.route('/')
def index():
    return render_template('index.html')

# Route to handle the calculation and provide sunlight and water requirements
@app.route('/calculate', methods=['GET'])
def calculate():
    crop = request.args.get("crop")
    city = request.args.get("city")
    acreage = float(request.args.get("acreage", 0))
    lang = request.args.get("lang", "en")

    # Dummy calculations
    water_needed = acreage * 500  # Example: 500 liters per acre
    sunlight_needed = f"{city} gets adequate sunlight."  # Placeholder

    return jsonify({
        "sunlight": sunlight_needed,
        "water": f"{water_needed} liters"
    })

def get_plant_info(crop, city, acreage):
    # Example logic for calculating sunlight and water
    sunlight = '12 hours/day'  # Example value
    water = f'{acreage * 10} liters/day'  # Example value based on acreage
    return sunlight, water

if __name__ == '__main__':
    app.run(debug=True)
