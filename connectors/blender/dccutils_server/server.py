import threading
import socket

import uvicorn

from .api import app


def find_free_port(port_range=range(10000, 10100)):
    for port in port_range:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(("127.0.0.1", port)) != 0:
                return port
    return False


def server_start(port_range=range(10000, 10100)):
    port = find_free_port(port_range)
    if port:
        uvicorn.run(app, host="127.0.0.1", port=port)
    else:
        print(
            "Cannot find a free port in the range [%i...%i]"
            % (port_range[0], port_range[len(port_range - 1)])
        )


def server_start_threading(
    port_range=range(10000, 10100)
):  # TODO : create a server stop
    thread = threading.Thread(target=server_start, kwargs={"port_range": port_range})
    thread.daemon = True
    thread.start()
    return thread
