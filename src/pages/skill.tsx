import { Star, StarBorder } from '@mui/icons-material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Treemap } from 'recharts'

import { Skill, SkillType } from '@api/services/entpb_pb'
import { SKILL_TREE_MAP } from '@constants/skill'
import { useSkill } from '@hooks/useSkill'
import { useSkillType } from '@hooks/useSkillType'

import Container from '../components/Container'

import { OutOfMessage } from './project'

function SkillCard({
  IDKey,
  iconName,
  name,
  level,
  experience,
  projects,
  description,
}: OutOfMessage<Skill> & {
  skillTypeList: OutOfMessage<SkillType>[]
}) {
  const levelCount = useMemo(() => {
    const _count = []

    for (let index = 1; index < 6; index++) {
      if (index <= level) {
        _count.push(<Star key={index} />)
      } else {
        _count.push(<StarBorder key={index} />)
      }
    }
    return _count
  }, [])

  const _experience = useMemo(() => {
    const _year = Math.floor(experience)
    const _month = (experience * 12) % 12
    return `約${_year ? `${_year}年` : ''}${_month ? `${_month}ヶ月` : ''}`
  }, [])

  return (
    <Card
      id={IDKey}
      className="w-full mb-10 dark:bg-transparent dark:border-white dark:border dark:shadow-none dark:text-gray-200">
      <CardContent>
        <div className="flex items-center mt-3">
          <i className={`${iconName} colored text-4xl mr-3 ml-1`} />
          <Typography className="text-4xl " variant="h3" component="div">
            {name}
          </Typography>
        </div>
        <span className="m-3" />
        <div className="flex items-center mb-2">
          <Typography variant="body2" className="mr-2">
            習熟度
          </Typography>
          <div className="flex">{levelCount}</div>
        </div>
        <div className="flex items-center mb-2">
          <Typography variant="body2" className="mr-2">
            経験年数
          </Typography>
          <Typography variant="body2">{_experience}</Typography>
        </div>
        <div className="flex items-center mb-2">
          <Typography variant="body2" className="mr-2">
            使用したプロジェクト
          </Typography>
          <Typography variant="body2">
            {projects?.map(({ name }) => name)?.join(', ')}
          </Typography>
        </div>
        <div className="markdown-body p-5">
          <ReactMarkdown unwrapDisallowed={true}>
            {Buffer.from(description).toString()}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  )
}

const useResizeObserver = (elements: any, callback: any) => {
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      callback(entries)
    })

    for (const elem of elements) {
      elem.current && resizeObserver.observe(elem.current)
    }

    return () => resizeObserver.disconnect()
  }, [])
}

export default function _Skill() {
  const { skillTypeList, fetchSkillTypeList } = useSkillType()
  const { skillList, fetchSkillList } = useSkill()
  useEffect(() => {
    fetchSkillTypeList()
    fetchSkillList()
  }, [])
  const skills = useMemo(() => {
    const _skills = []
    const skillLength = skillList.length
    for (let index = 0; index < skillLength; index++) {
      const skill = skillList[index]
      _skills.push(
        <SkillCard
          key={index.toString()}
          {...skill}
          skillTypeList={skillTypeList}
        />
      )
    }

    return _skills
  }, [skillList, skillTypeList])

  const [width, setWidth] = useState(0)
  const ref = useRef(null)

  const handleResize = (entries: any) => {
    const width = entries[0].contentRect.width
    setWidth(Math.floor(width))
  }

  useResizeObserver([ref], handleResize)

  return (
    // <Suspense fallback={null}>
    <Container>
      <div
        ref={ref}
        className="flex flex-col justify-center items-start w-full max-w-4xl border-gray-200 dark:border-gray-700 mx-auto pb-16">
        <div className="flex flex-col-reverse sm:flex-row items-start">
          <div className="flex flex-col pr-8">
            <Typography
              variant="h1"
              className="font-bold text-3xl md:text-4xl tracking-tight mb-1 text-black dark:text-gray-200">
              スキルセット
            </Typography>
            <Typography variant="body1" className="mb-10 text-gray-400">
              自身が経験した、プロジェクトや個人プロジェクトで獲得したスキルセットを記載しています。
              この技術を採用（業務で利用）した理由。
              私が考えるこの技術を使う上でのメリット・デメリット（複数の技術と比較できるとベスト）
              この技術で抱えている課題と解決へのソリューション
            </Typography>
          </div>
        </div>
        <Treemap
          className="treemap"
          isAnimationActive={false}
          width={width}
          height={width * 0.6}
          data={SKILL_TREE_MAP}
          dataKey="size"
          aspectRatio={5 / 4}
          onClick={(e) => {
            const targetEl = document.getElementById(e?.key)
            targetEl?.scrollIntoView({ behavior: 'smooth' })
          }}
          // type="nest"
          // fill="#000"
          // stroke="#ffffff"
        />
        <span className="h-16" />
        {skills}
        <span className="h-16" />
      </div>
    </Container>
    // </Suspense>
  )
}
