import React, { ReactNode, MouseEvent } from 'react';
import styled from 'styled-components';
import { darken } from 'polished';

import timings from '../../enums/timings';
import { StyledBaseDiv } from '../../htmlElements';
import { SubcomponentPropsType, StyledSubcomponentType } from '../commonTypes';
import { useAnalytics, useTheme } from '../../context';
import { getShadowStyle } from '../../utils/styles';
import InteractionFeedback, {
  InteractionFeedbackProps,
} from '../InteractionFeedback/InteractionFeedback';
import FeedbackTypes from '../../enums/feedbackTypes';

const defaultOnClick = () => {};

export type CardContainerProps = {
  elevation: number;
  feedbackType: FeedbackTypes;
  isDefaultOnClick: boolean;
};

export const CardContainer = styled(StyledBaseDiv)`
  ${({ elevation, feedbackType, isDefaultOnClick }: CardContainerProps) => {
    const { colors } = useTheme();

    return `
      ${!isDefaultOnClick ? 'cursor: pointer;' : ''}
      display: inline-flex;
      flex-flow: column nowrap;
      font-size: 1em;
      border-radius: 0.25rem;
      border: ${!elevation ? `1px solid ${colors.grayXlight}` : '0px solid transparent'};
      transition:
        filter ${timings.slow},
        box-shadow ${timings.slow},
        border ${timings.normal},
        background-color ${timings.normal};
      ${getShadowStyle(elevation, colors.shadow)}
      background-color: ${colors.background};
      ${
        feedbackType === FeedbackTypes.simple && !isDefaultOnClick
          ? `
            &:active {
              background-color: ${
                colors.background !== 'transparent'
                  ? darken(0.1, colors.background)
                  : 'rgba(0, 0, 0, 0.1)'
              };
            }
          `
          : ''
      }
  `;
  }}
`;

export const Header = styled(StyledBaseDiv)`
  ${({ hasBody, hasFooter }) => {
    const { colors } = useTheme();

    return `
      padding: 1.5em 1.5em ${hasBody || hasFooter ? '0em' : ''};
      border-radius: 0.25rem 0.25rem 0rem 0rem;
      font-weight: bold;
      color: ${colors.grayDark};
    `;
  }}
`;

export const NoPaddingHeader = styled(Header)`
  padding: 0;
`;

export const Body = styled(StyledBaseDiv)`
  ${() => {
    const { colors } = useTheme();

    return `
      padding: 1.5em 1.5em;
      color: ${colors.grayMedium};
    `;
  }}
`;

export const Footer = styled(StyledBaseDiv)`
  ${() => {
    const { colors } = useTheme();

    return `
      padding: 1em 1.5em;
      display: flex;
      flex-flow: row wrap;

      justify-content: flex-end;

      color: ${colors.grayLight};

      border-radius: 0rem 0rem 0.25rem 0.25rem;
    `;
  }}
`;

const StyledFeedbackContainer = styled(InteractionFeedback.Container)`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
`;
export interface CardProps {
  StyledContainer?: StyledSubcomponentType;
  StyledHeader?: StyledSubcomponentType;
  StyledBody?: StyledSubcomponentType;
  StyledFooter?: StyledSubcomponentType;

  containerProps?: SubcomponentPropsType;
  headerProps?: SubcomponentPropsType;
  bodyProps?: SubcomponentPropsType;
  footerProps?: SubcomponentPropsType;
  interactionFeedbackProps?: Omit<InteractionFeedbackProps, 'children'>;

  onClick?: (evt: MouseEvent) => void;

  header?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;

  elevation?: number;
  disableFeedback?: boolean;
  feedbackType?: FeedbackTypes;

  containerRef?: React.RefObject<HTMLDivElement>;
  headerRef?: React.RefObject<HTMLDivElement>;
  bodyRef?: React.RefObject<HTMLDivElement>;
  footerRef?: React.RefObject<HTMLDivElement>;
  interactiveFeedbackRef?: React.RefObject<HTMLDivElement>;
}

const Card = ({
  StyledContainer = CardContainer,
  StyledHeader = Header,
  StyledBody = Body,
  StyledFooter = Footer,

  containerProps,
  headerProps,
  bodyProps,
  footerProps,
  interactionFeedbackProps,

  containerRef,
  headerRef,
  bodyRef,
  footerRef,
  interactiveFeedbackRef,

  onClick = defaultOnClick,

  header,
  children,
  footer,

  elevation = 1,
  feedbackType = FeedbackTypes.ripple,
}: CardProps): JSX.Element | null => {
  const transitionProps = {
    ...InteractionFeedback.defaultTransitionProps,
    enter: {
      ...InteractionFeedback.defaultTransitionProps,
      r: 300,
    },
  };
  const hasHeader = Boolean(header);
  const hasBody = Boolean(children);
  const hasFooter = Boolean(footer);

  const handleEventWithAnalytics = useAnalytics();
  const handleClick = (e: any) =>
    handleEventWithAnalytics('Card', onClick, 'onClick', e, containerProps || { name: 'Card' });
  const isDefaultOnClick = onClick === defaultOnClick;

  return (
    <StyledContainer
      onClick={handleClick}
      elevation={elevation}
      feedbackType={feedbackType}
      isDefaultOnClick={isDefaultOnClick}
      {...containerProps}
      ref={containerRef}
    >
      {header && (
        <StyledHeader hasBody={hasBody} hasFooter={hasFooter} ref={headerRef} {...headerProps}>
          {header}
        </StyledHeader>
      )}
      {children && (
        <StyledBody hasHeader={hasHeader} hasFooter={hasFooter} ref={bodyRef} {...bodyProps}>
          {children}
        </StyledBody>
      )}
      {footer && (
        <StyledFooter hasHeader={hasHeader} hasBody={hasBody} ref={footerRef} {...footerProps}>
          {footer}
        </StyledFooter>
      )}
      {feedbackType !== FeedbackTypes.simple && onClick !== defaultOnClick && (
        <InteractionFeedback
          color="rgba(0,0,0,0.1)"
          transitionProps={transitionProps}
          StyledContainer={StyledFeedbackContainer}
          containerRef={interactiveFeedbackRef}
          {...interactionFeedbackProps}
        />
      )}
    </StyledContainer>
  );
};

Card.Header = Header;
Card.NoPaddingHeader = NoPaddingHeader;
Card.Footer = Footer;
Card.Body = Body;
Card.Container = CardContainer;

export default Card;
