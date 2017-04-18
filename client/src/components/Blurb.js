/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

import Box from './Box';
import ScrollButton from './ScrollButton';

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
              <ScrollButton
                bsStyle="link"
                className="box-btn"
                href="#launch"
                to="#launch"
                spy
                smooth
                offset={-50}
                duration={500}
                delay={50}
              >
                Launch a cluster on AWS
              </ScrollButton>
            </Col>
          </Row>
        </Col>
        <Col md={4}>
          <div className="special-box-inner">
            <h3 className="box-title">What is the Alces Flight Launch Service?</h3>

            <p>Developed by the team at Alces Flight, the Alces Flight Launch
              Service has been developed to quickly launch a preconfigured
              High Performance Computing (HPC) cluster.  With the Alces Flight
              Launch Service you gain temporary access to instant, single-user
              scientific computing at no cost to you.</p>

            <p>The Alces Flight Launch Service rapidly delivers a whole HPC
              cluster, ready to go and complete with job schedule and
              applications.  Simply select the HPC cluster you want to
              evaluate, enter your Flight Launch token, HPC cluster name, and
              an email address for notifications and you are ready to go!</p>

            <p>Clusters are deployed in a Virtual Private (VPC) environment
              for security, with SSH and graphical-desktop connectivity for
              users.  Data management tools for POSIX and S3 object storage
              are also included to help users transfer files and manage
              storage resources.</p>
          </div>
        </Col>
      </Row>
    </Grid>
  </section>
);

export default Blurb;
