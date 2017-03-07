/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Alces Lackey.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import { Button, Grid, Row, Col } from 'react-bootstrap';

import Box from './Box';

const Blurb = () => (
  <section>
    <Grid className="flight-blurb">
      <Row>
        <Col md={8}>
          <Row>
            <Box cols={6} iconName="cog" title="LAUNCH" >
              <p>
                Self-configuring High Performance Compute environment - jump
                straight to the science instead of the configuration.
              </p>
            </Box>
            <Box cols={6} iconName="th-large" title="EXECUTE" >
              <p>
                Simple installation of over 1,000 Linux applications,
                accelerated libraries and compilers.
              </p>
            </Box>
            <Box cols={6} iconName="comments-o" title="COLLABORATE" >
              <p>
                Share your analysis, methodology and results consistently across
                research teams.
              </p>
            </Box>
            <Box cols={6} iconName="desktop" title="INTERACT" >
              <p>Easily access your personal cluster using integrated remote
                desktops.</p>
            </Box>
            <Box cols={6} iconName="cloud" title="STORE" >
              <p>Effortlessly store and retrieve your data sets, results and
                workflows.</p>
            </Box>
            <Box cols={6} iconName="flask" title="ACCOMPLISH" >
              <p>Perform your scientific computing with efficiency and
                speed.</p>
            </Box>
          </Row>
          <Row>
            <Col md={12} className="text-center">
              <Button bsStyle="link" className="box-btn" href="#launch">
                Launch a cluster on AWS
              </Button>
            </Col>
          </Row>
        </Col>
        <Col md={4}>
          <div className="special-box-inner">
            <h3 className="box-title">What is Alces Flight Compute?</h3>
            <p>Alces Flight Compute provides a fully-featured, scalable High
              Performance Computing (HPC) environment for research and
              scientific computing.</p>
            <p>Compatible with both on-demand and spot instances, Flight rapidly
              delivers a whole HPC cluster, ready to go and complete with job
              scheduler and applications.</p>
            <p>Clusters are deployed in a Virtual Private Cluster (VPC)
              environment for security, with SSH and graphical-desktop
              connectivity for users. Data management tools for POSIX and S3
              object storage are also included to help users transfer files and
              manage storage resources.</p>
          </div>
        </Col>
      </Row>
    </Grid>
  </section>
);

export default Blurb;
