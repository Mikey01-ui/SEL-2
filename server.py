import http.server
import socketserver
import webbrowser
import threading
import os

PORT = int(os.environ.get('PORT', '8081'))

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

def open_browser():
    url = f"http://localhost:{PORT}/index.html"
    try:
        webbrowser.open(url)
    except Exception:
        pass

if __name__ == "__main__":
    os.chdir(os.path.dirname(__file__) or ".")
    with socketserver.TCPServer(("", PORT), QuietHandler) as httpd:
        print(f"Serving S-E-L at http://localhost:{PORT}/index.html")
        threading.Timer(0.8, open_browser).start()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
        finally:
            httpd.server_close()
