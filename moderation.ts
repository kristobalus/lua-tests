import {
    Column,
    Entity,
    Generated,
    Index,
    PrimaryColumn,
    BaseEntity
} from 'typeorm'

@Entity()
@Index(['organizationId', 'eventId'], { unique: true })
export class Moderation extends BaseEntity  {

    @PrimaryColumn()
    public id: number

    @Index()
    @Column({ name: 'organization_id' })
    public organizationId: string

    @Index()
    @Column({ name: 'event_id' })
    public eventId: number

    @Column({ name: 'event_status', type: 'integer', default: 0 })
    public eventStatus: any

    @Column({ name: 'feed_id' })
    @Generated('uuid')
    public feedId: string

    @Column({ name: 'onboarding_enabled', default: false })
    public onboardingEnabled: boolean

    @Column({
        name: 'question_settings',
        nullable: true,
        type: 'jsonb',
    })
    public questionSettings: any

    @Column({
        nullable: true,
        type: 'jsonb',
    })
    public sponsors: any

    @Column({
        nullable: true,
        type: 'jsonb',
    })
    public notifications: any
}