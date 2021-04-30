from flask import render_template
from app import app

template_path = {
    "home": "index.html"
}


@app.route("/")
def home():
    return render_template(template_path['home'])
