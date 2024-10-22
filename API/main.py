from api import create_app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port = "https://summary-spot-m.vercel.app/")
