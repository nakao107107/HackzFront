import { mapKeysCamelCase } from '~/utilities/map_keys_convert.js'
import {
  ConsoleLogger,
  DefaultDeviceController,
  DefaultMeetingSession,
  LogLevel,
  MeetingSessionConfiguration,
} from 'amazon-chime-sdk-js'

export const actions = {
  async create(ctx, meetingId) {
    const { error } = await this.$http().post(
      `/meetings/${meetingId}/room`
    )
    if (error) {
      throw new Error('ミーティングルームの作成に失敗しました')
    }
  },

  async fetch(ctx, meetingId) {
    const {
      data,
      error,
    } = await this.$http().get(
      `/meetings/${meetingId}/room`
    )
    if (error) {
      throw new Error('セッション情報の取得に失敗しました')
    }

    const logger = new ConsoleLogger('MyLogger', LogLevel.ERROR)
    const deviceController = new DefaultDeviceController(logger)
    const room = mapKeysCamelCase(data.room)
    const attendee = mapKeysCamelCase(data.attendee)
    const configuration = new MeetingSessionConfiguration(room, attendee)
    const meetingSession = new DefaultMeetingSession(
      configuration,
      logger,
      deviceController
    )
    return meetingSession
  },
}
