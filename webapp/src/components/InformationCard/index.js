/* eslint camelcase: 0 */
import React, { memo, useState, useEffect } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'
import { useTranslation } from 'react-i18next'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import 'flag-icon-css/css/flag-icon.min.css'

import { formatData } from '../../utils'
import ProducerHealthIndicators from '../ProducerHealthIndicators'

import Information from './Information'
import Nodes from './Nodes'
import Social from './Social'
import Media from './Media'
import Endpoints from './Endpoints'
import styles from './styles'

const useStyles = makeStyles(styles)

const InformationCard = ({ producer, rank, onNodeClick, type }) => {
  const classes = useStyles()
  const theme = useTheme()
  const { t } = useTranslation('producerCardComponent')
  const matches = useMediaQuery(theme.breakpoints.up('lg'))
  const [expanded, setExpanded] = useState(false)
  const [producerOrg, setProducerOrg] = useState({})

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  useEffect(() => {
    setProducerOrg(
      formatData(
        {
          data: producer.bp_json?.org || {},
          rank,
          owner: producer.owner,
          updatedAt: producer.updated_at,
          missedBlocks: producer.missed_blocks || [],
          nodes: producer.bp_json?.nodes || [],
          healthStatus: producer.health_status,
          dataType: producer.bp_json?.type,
          node: producer.node
        },
        type,
        t
      )
    )
    // eslint-disable-next-line
  }, [producer])

  return (
    <Card className={classes.root}>
      <CardHeader title={producerOrg.title} />
      <Box className={classes.wrapper}>
        <Box className={classes.media}>
          <Media classes={classes} media={producerOrg.media || {}} />
        </Box>
        <Collapse
          in={matches ? true : expanded}
          timeout="auto"
          unmountOnExit
          className={classes.collapse}
        >
          <Box className="bodyWrapper">
            <Box className={clsx(classes.info, classes[type])}>
              <Typography variant="overline">{t('info')}</Typography>
              <Information
                info={producerOrg.info}
                classes={classes}
                t={t}
                type={type}
              />
            </Box>
            <Endpoints
              endpoints={producerOrg.endpoints}
              classes={classes}
              t={t}
              type={type}
            />
            <Nodes
              nodes={producerOrg.nodes}
              producer={producer}
              t={t}
              onNodeClick={onNodeClick}
              type={type}
              classes={classes}
            />
            <Box className={classes.healthStatus}>
              <Typography variant="overline">{t('health')}</Typography>
              <Box className={classes.borderLine}>
                <Box className={classes.rowWrapper}>
                  <Typography variant="body1">
                    {`${t('missedBlocks')}: `}
                    {(producer.missed_blocks || []).reduce(
                      (result, current) => result + current.value,
                      0
                    )}
                  </Typography>
                </Box>

                <ProducerHealthIndicators
                  message={t('noData')}
                  producer={
                    producerOrg?.healthStatus
                      ? { health_status: producerOrg.healthStatus }
                      : { health_status: [] }
                  }
                />
              </Box>
            </Box>
            <Social
              social={producerOrg?.social || {}}
              type={type}
              t={t}
              classes={classes}
            />
          </Box>
        </Collapse>
      </Box>
      <CardActions disableSpacing className={classes.cardActions}>
        <Box className={classes.expandMore}>
          <Button color="primary" onClick={handleExpandClick}>
            {expanded ? t('collapse') : t('moreInfo')}
          </Button>
        </Box>
      </CardActions>
    </Card>
  )
}

InformationCard.propTypes = {
  producer: PropTypes.any,
  rank: PropTypes.number,
  onNodeClick: PropTypes.func,
  type: PropTypes.string
}

InformationCard.defaultProps = {
  producer: {},
  rank: 0,
  onNodeClick: () => {},
  type: ''
}

export default memo(InformationCard)
