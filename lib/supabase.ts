import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function saveQuestionnaireData(data: Record<string, unknown>) {
  const { data: result, error } = await supabase
    .from('respuestas')
    .insert({
      consentimiento: data['consentimiento'],
      document_id: data['document_id'],
      name: data['name'],
      nationality: data['nationality'],
      birthdate: data['birthdate'],
      devices: data['devices'],
      tech_time: data['tech_time'],
      socio_stratum: data['socio_stratum'],
      ai_knowledge: data['ai_knowledge'],
      ai_trust_epistemic: data['ai_trust_epistemic'],
      ai_trust_social: data['ai_trust_social'],
      human_trust_epistemic: data['human_trust_epistemic'],
      human_trust_social: data['human_trust_social'],
      rui_1: data['rui_1'], rui_2: data['rui_2'], rui_3: data['rui_3'],
      rui_4: data['rui_4'], rui_5: data['rui_5'], rui_6: data['rui_6'],
      rui_7: data['rui_7'], rui_8: data['rui_8'], rui_9: data['rui_9'],
      rui_10: data['rui_10'],
      gn_1: data['gn_1'], gn_2: data['gn_2'], gn_3: data['gn_3'], gn_4: data['gn_4'],
      what_can_ai_do_1: data['what_can_ai_do_1'], what_can_ai_do_2: data['what_can_ai_do_2'],
      what_can_ai_do_3: data['what_can_ai_do_3'], what_can_ai_do_4: data['what_can_ai_do_4'],
      what_can_ai_do_5: data['what_can_ai_do_5'],
      how_does_ai_work_1: data['how_does_ai_work_1'], how_does_ai_work_2: data['how_does_ai_work_2'],
      how_does_ai_work_3: data['how_does_ai_work_3'], how_does_ai_work_4: data['how_does_ai_work_4'],
      how_does_ai_work_5: data['how_does_ai_work_5'], how_does_ai_work_6: data['how_does_ai_work_6'],
      how_does_ai_work_7: data['how_does_ai_work_7'], how_does_ai_work_8: data['how_does_ai_work_8'],
      how_does_ai_work_9: data['how_does_ai_work_9'], how_does_ai_work_10: data['how_does_ai_work_10'],
      how_does_ai_work_11: data['how_does_ai_work_11'], how_does_ai_work_12: data['how_does_ai_work_12'],
      how_does_ai_work_13: data['how_does_ai_work_13'], how_does_ai_work_14: data['how_does_ai_work_14'],
      how_does_ai_work_15: data['how_does_ai_work_15'], how_does_ai_work_16: data['how_does_ai_work_16'],
      how_does_ai_work_17: data['how_does_ai_work_17'], how_does_ai_work_18: data['how_does_ai_work_18'],
      how_does_ai_work_19: data['how_does_ai_work_19'], how_does_ai_work_20: data['how_does_ai_work_20'],
      how_does_ai_work_21: data['how_does_ai_work_21'], how_does_ai_work_22: data['how_does_ai_work_22'],
      how_does_ai_work_23: data['how_does_ai_work_23'],
      how_should_ai_be_used_1: data['how_should_ai_be_used_1'],
      how_should_ai_be_used_2: data['how_should_ai_be_used_2'],
      how_should_ai_be_used_3: data['how_should_ai_be_used_3'],
      how_should_ai_be_used_4: data['how_should_ai_be_used_4'],
      how_should_ai_be_used_5: data['how_should_ai_be_used_5'],
      how_should_ai_be_used_6: data['how_should_ai_be_used_6'],
      how_should_ai_be_used_7: data['how_should_ai_be_used_7'],
      how_should_ai_be_used_8: data['how_should_ai_be_used_8'],
      how_should_ai_be_used_9: data['how_should_ai_be_used_9'],
      how_should_ai_be_used_10: data['how_should_ai_be_used_10'],
    })
    .select('id')
    .single()

  if (error) throw error
  return result.id as string
}

export async function findParticipantByDocument(documentId: string) {
  const { data, error } = await supabase
    .from('respuestas')
    .select('id, name')
    .eq('document_id', documentId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) return null
  return data
}

export async function saveSituationResponse(
  participantId: string,
  situationIndex: number,
  responseTime: number,
  sliderValue: number
) {
  const { error } = await supabase
    .from('situationresponses')
    .insert({
      participant_id: participantId,
      situation_index: situationIndex,
      response: `${sliderValue} - ${responseTime.toFixed(2)}`,
    })

  if (error) throw error
}
