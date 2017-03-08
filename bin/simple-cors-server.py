#! /usr/bin/env python2
#=============================================================================
# Copyright (C) 2015 Stephen F. Norledge and Alces Software Ltd.
#
# This file is part of Flight Launch.
#
# All rights reserved, see LICENSE.txt.
#=============================================================================

import sys
import getopt
from SimpleHTTPServer import SimpleHTTPRequestHandler
import BaseHTTPServer
import ssl

class CORSRequestHandler (SimpleHTTPRequestHandler):
    def end_headers (self):
        self.send_header('Access-Control-Allow-Origin', '*')
        SimpleHTTPRequestHandler.end_headers(self)

def run_ssl_server(port, use_ssl):
    server_address = ('', port)

    httpd = BaseHTTPServer.HTTPServer(server_address, CORSRequestHandler)

    if use_ssl:
        httpd.socket = ssl.wrap_socket (httpd.socket, certfile='../certs/server.pem', server_side=True)
    sa = httpd.socket.getsockname()
    if use_ssl:
        print "Serving HTTPs on", sa[0], "port", sa[1], "..."
    else:
        print "Serving HTTP on", sa[0], "port", sa[1], "..."
    httpd.serve_forever()


def parse_opts(argv):
    use_ssl = False
    try:
       opts, args = getopt.getopt(argv,"h",["ssl"])
    except getopt.GetoptError:
       print 'simple-cors-server.py --ssl PORT'
       sys.exit(2)
    for opt, arg in opts:
       if opt == '-h':
           print 'simple-cors-server.py --ssl PORT'
           sys.exit()
       elif opt in ("--ssl"):
           use_ssl = True
    if len(args) == 1:
        try:
            port = int(args[0])
        except ValueError:
           print 'simple-cors-server.py --ssl PORT'
           sys.exit(2)
    else:
        port = 3002
    return port, use_ssl

if __name__ == '__main__':
    port, use_ssl = parse_opts(sys.argv[1:])
    run_ssl_server(port, use_ssl)
