import React from 'react';
// import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { Styles } from 'flight-reactware';
import styled from 'styled-components';


export const CardMedias = styled.div`
  margin: 5px 20px;
  & > :first-child {
      padding-top: 15px;
  }
`;
const CardMediaIcon = styled(FontAwesome)`
  ${Styles.textMuted};
  float: left;
  line-height: 40px;
  font-size: 150%;
  padding-top: 5px;
  text-align: center;
`;
const CardMediaHeader = styled.div`
  font-weight: bold;
  ${Styles.textMuted};
  padding-left: 40px;
  margin-top: 0;
`;
const CardMediaBody = styled.div`
  padding-left: 40px;
`;

export const CardMedia = styled(({ className, children, iconName, title }) => {
  return (
    <div className={className}>
      <CardMediaIcon name={iconName} />
      <CardMediaHeader>{title}</CardMediaHeader>
      <CardMediaBody>{children}</CardMediaBody>
    </div>
  );
})`
  border-bottom: 1px solid ${Styles.textMutedColour};
  margin-bottom: 15px;
  padding-bottom: 15px;
`;
