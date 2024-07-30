#!/bin/bash
docker run -d --rm --name cnse-mongo -v "/tmp/cnse-class/mongo:/data/db" -p 27017:27017  mongo