import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

const BASE_URL = 'https://api.sarvam.ai';

const STT_LANGUAGES = [
	{ name: 'Auto Detect', value: 'unknown' },
	{ name: 'Assamese', value: 'as-IN' },
	{ name: 'Bengali', value: 'bn-IN' },
	{ name: 'Bodo', value: 'brx-IN' },
	{ name: 'Dogri', value: 'doi-IN' },
	{ name: 'English', value: 'en-IN' },
	{ name: 'Gujarati', value: 'gu-IN' },
	{ name: 'Hindi', value: 'hi-IN' },
	{ name: 'Kannada', value: 'kn-IN' },
	{ name: 'Kashmiri', value: 'ks-IN' },
	{ name: 'Konkani', value: 'kok-IN' },
	{ name: 'Maithili', value: 'mai-IN' },
	{ name: 'Malayalam', value: 'ml-IN' },
	{ name: 'Manipuri', value: 'mni-IN' },
	{ name: 'Marathi', value: 'mr-IN' },
	{ name: 'Nepali', value: 'ne-IN' },
	{ name: 'Odia', value: 'od-IN' },
	{ name: 'Punjabi', value: 'pa-IN' },
	{ name: 'Sanskrit', value: 'sa-IN' },
	{ name: 'Santali', value: 'sat-IN' },
	{ name: 'Sindhi', value: 'sd-IN' },
	{ name: 'Tamil', value: 'ta-IN' },
	{ name: 'Telugu', value: 'te-IN' },
	{ name: 'Urdu', value: 'ur-IN' },
];

const TTS_LANGUAGES = [
	{ name: 'Bengali', value: 'bn-IN' },
	{ name: 'English', value: 'en-IN' },
	{ name: 'Gujarati', value: 'gu-IN' },
	{ name: 'Hindi', value: 'hi-IN' },
	{ name: 'Kannada', value: 'kn-IN' },
	{ name: 'Malayalam', value: 'ml-IN' },
	{ name: 'Marathi', value: 'mr-IN' },
	{ name: 'Odia', value: 'od-IN' },
	{ name: 'Punjabi', value: 'pa-IN' },
	{ name: 'Tamil', value: 'ta-IN' },
	{ name: 'Telugu', value: 'te-IN' },
];

const TTS_SPEAKERS = [
	{ name: 'Aayan', value: 'aayan' },
	{ name: 'Aditya', value: 'aditya' },
	{ name: 'Advait', value: 'advait' },
	{ name: 'Amit', value: 'amit' },
	{ name: 'Anand', value: 'anand' },
	{ name: 'Ashutosh', value: 'ashutosh' },
	{ name: 'Dev', value: 'dev' },
	{ name: 'Gokul', value: 'gokul' },
	{ name: 'Ishita', value: 'ishita' },
	{ name: 'Kabir', value: 'kabir' },
	{ name: 'Kavitha', value: 'kavitha' },
	{ name: 'Kavya', value: 'kavya' },
	{ name: 'Manan', value: 'manan' },
	{ name: 'Mani', value: 'mani' },
	{ name: 'Mohit', value: 'mohit' },
	{ name: 'Neha', value: 'neha' },
	{ name: 'Pooja', value: 'pooja' },
	{ name: 'Priya', value: 'priya' },
	{ name: 'Rahul', value: 'rahul' },
	{ name: 'Ratan', value: 'ratan' },
	{ name: 'Rehan', value: 'rehan' },
	{ name: 'Ritu', value: 'ritu' },
	{ name: 'Rohan', value: 'rohan' },
	{ name: 'Roopa', value: 'roopa' },
	{ name: 'Rupali', value: 'rupali' },
	{ name: 'Shreya', value: 'shreya' },
	{ name: 'Shruti', value: 'shruti' },
	{ name: 'Shubh', value: 'shubh' },
	{ name: 'Simran', value: 'simran' },
	{ name: 'Soham', value: 'soham' },
	{ name: 'Suhani', value: 'suhani' },
	{ name: 'Sumit', value: 'sumit' },
	{ name: 'Sunny', value: 'sunny' },
	{ name: 'Tanya', value: 'tanya' },
	{ name: 'Tarun', value: 'tarun' },
	{ name: 'Varun', value: 'varun' },
	{ name: 'Vijay', value: 'vijay' },
];

const TTS_SPEAKERS_V4 = [
	{ name: 'aarti_hi_customer', value: 'aarti_hi_customer' },
	{ name: 'aayan_hi_conversational', value: 'aayan_hi_conversational' },
	{ name: 'aditi_en_stories', value: 'aditi_en_stories' },
	{ name: 'aditya_hi_conversational', value: 'aditya_hi_conversational' },
	{ name: 'aditya_hi_sales', value: 'aditya_hi_sales' },
	{ name: 'advait_hi_character', value: 'advait_hi_character' },
	{ name: 'amelia_en_conversational', value: 'amelia_en_conversational' },
	{ name: 'amit_hi_conversational', value: 'amit_hi_conversational' },
	{ name: 'anand_hi_documentary', value: 'anand_hi_documentary' },
	{ name: 'anand_hi_news', value: 'anand_hi_news' },
	{ name: 'anand_pa_conversation', value: 'anand_pa_conversation' },
	{ name: 'anand_pa_customer', value: 'anand_pa_customer' },
	{ name: 'aparna_en_companion', value: 'aparna_en_companion' },
	{ name: 'aparna_en_edtech', value: 'aparna_en_edtech' },
	{ name: 'aparna_hi_customer', value: 'aparna_hi_customer' },
	{ name: 'aparna_hi_kyc', value: 'aparna_hi_kyc' },
	{ name: 'aravind_ta_ads', value: 'aravind_ta_ads' },
	{ name: 'aravind_ta_suspense', value: 'aravind_ta_suspense' },
	{ name: 'arnab_bn_conversation', value: 'arnab_bn_conversation' },
	{ name: 'aryaman_hi_ads', value: 'aryaman_hi_ads' },
	{ name: 'ashok_hi_character', value: 'ashok_hi_character' },
	{ name: 'ashok_hi_news', value: 'ashok_hi_news' },
	{ name: 'ashutosh_hi_conversational', value: 'ashutosh_hi_conversational' },
	{ name: 'ashwin_en_sports', value: 'ashwin_en_sports' },
	{ name: 'ashwin_en_sports_energetic', value: 'ashwin_en_sports_energetic' },
	{ name: 'bhavik_gu_conversation', value: 'bhavik_gu_conversation' },
	{ name: 'bimal_bn_suspense', value: 'bimal_bn_suspense' },
	{ name: 'chaitra_hi_customer', value: 'chaitra_hi_customer' },
	{ name: 'chaitra_kn_conversation', value: 'chaitra_kn_conversation' },
	{ name: 'chaitra_kn_narration', value: 'chaitra_kn_narration' },
	{ name: 'chandrika_en_stories', value: 'chandrika_en_stories' },
	{ name: 'chetan_kn_conversation', value: 'chetan_kn_conversation' },
	{ name: 'chhavi_hi_kids', value: 'chhavi_hi_kids' },
	{ name: 'chirag_hi_social', value: 'chirag_hi_social' },
	{ name: 'dev_en_conversational', value: 'dev_en_conversational' },
	{ name: 'dev_en_recovery', value: 'dev_en_recovery' },
	{ name: 'deven_en_conversation', value: 'deven_en_conversation' },
	{ name: 'girish_en_devotional', value: 'girish_en_devotional' },
	{ name: 'girish_en_documentary', value: 'girish_en_documentary' },
	{ name: 'girish_hi_devotional', value: 'girish_hi_devotional' },
	{ name: 'gokul_ta_narration', value: 'gokul_ta_narration' },
	{ name: 'harpreet_pa_narration', value: 'harpreet_pa_narration' },
	{ name: 'ishita_en_customer', value: 'ishita_en_customer' },
	{ name: 'ishita_en_medical', value: 'ishita_en_medical' },
	{ name: 'ishita_en_numbers', value: 'ishita_en_numbers' },
	{ name: 'ishita_en_social', value: 'ishita_en_social' },
	{ name: 'ishita_en_stories', value: 'ishita_en_stories' },
	{ name: 'ishita_enhi_companion', value: 'ishita_enhi_companion' },
	{ name: 'ishita_enhi_customer', value: 'ishita_enhi_customer' },
	{ name: 'ishita_enhi_customer_expressive', value: 'ishita_enhi_customer_expressive' },
	{ name: 'ishita_hi_ads', value: 'ishita_hi_ads' },
	{ name: 'ishita_hi_ads_informal', value: 'ishita_hi_ads_informal' },
	{ name: 'ishita_hi_banking', value: 'ishita_hi_banking' },
	{ name: 'ishita_hi_devotional', value: 'ishita_hi_devotional' },
	{ name: 'ishita_hi_edtech', value: 'ishita_hi_edtech' },
	{ name: 'ishita_hi_numbers', value: 'ishita_hi_numbers' },
	{ name: 'ishita_hi_social', value: 'ishita_hi_social' },
	{ name: 'ishita_mr_conversational', value: 'ishita_mr_conversational' },
	{ name: 'jaspal_pa_banking', value: 'jaspal_pa_banking' },
	{ name: 'kabir_hi_conversational', value: 'kabir_hi_conversational' },
	{ name: 'kalpit_en_edtech', value: 'kalpit_en_edtech' },
	{ name: 'kavitha_te_conversation', value: 'kavitha_te_conversation' },
	{ name: 'kavitha_te_narration', value: 'kavitha_te_narration' },
	{ name: 'kavya_hi_conversational', value: 'kavya_hi_conversational' },
	{ name: 'kunal_hi_kids', value: 'kunal_hi_kids' },
	{ name: 'mahesh_hi_documentary', value: 'mahesh_hi_documentary' },
	{ name: 'manan_hi_conversational', value: 'manan_hi_conversational' },
	{ name: 'mani_hi_conversational', value: 'mani_hi_conversational' },
	{ name: 'mani_hi_devotional', value: 'mani_hi_devotional' },
	{ name: 'mohit_hi_conversational', value: 'mohit_hi_conversational' },
	{ name: 'mrunal_mr_narration', value: 'mrunal_mr_narration' },
	{ name: 'mukul_hi_ads', value: 'mukul_hi_ads' },
	{ name: 'mukul_hi_suspense', value: 'mukul_hi_suspense' },
	{ name: 'mukul_mr_stories', value: 'mukul_mr_stories' },
	{ name: 'nachiket_en_ads', value: 'nachiket_en_ads' },
	{ name: 'nachiket_hi_devotional', value: 'nachiket_hi_devotional' },
	{ name: 'neha_en_customer', value: 'neha_en_customer' },
	{ name: 'neha_en_latenight', value: 'neha_en_latenight' },
	{ name: 'neha_mr_narration', value: 'neha_mr_narration' },
	{ name: 'nilesh_mr_conversation', value: 'nilesh_mr_conversation' },
	{ name: 'nupur_en_kids', value: 'nupur_en_kids' },
	{ name: 'ojas_en_social', value: 'ojas_en_social' },
	{ name: 'payal_en_edtech', value: 'payal_en_edtech' },
	{ name: 'pooja_gu_conversational', value: 'pooja_gu_conversational' },
	{ name: 'pooja_gu_customer', value: 'pooja_gu_customer' },
	{ name: 'pooja_te_conversation', value: 'pooja_te_conversation' },
	{ name: 'priya_hi_recovery', value: 'priya_hi_recovery' },
	{ name: 'rahul_hi_conversational', value: 'rahul_hi_conversational' },
	{ name: 'ratan_hi_customer_expressive', value: 'ratan_hi_customer_expressive' },
	{ name: 'ratan_hi_devotional', value: 'ratan_hi_devotional' },
	{ name: 'ratan_hi_documentary', value: 'ratan_hi_documentary' },
	{ name: 'ratan_hi_latenight', value: 'ratan_hi_latenight' },
	{ name: 'ratan_hi_latenight_warm', value: 'ratan_hi_latenight_warm' },
	{ name: 'ratan_hi_recovery', value: 'ratan_hi_recovery' },
	{ name: 'ratan_hi_social', value: 'ratan_hi_social' },
	{ name: 'ratan_hi_sports', value: 'ratan_hi_sports' },
	{ name: 'rehan_hi_social', value: 'rehan_hi_social' },
	{ name: 'ritu_en_edtech', value: 'ritu_en_edtech' },
	{ name: 'ritu_en_latenight', value: 'ritu_en_latenight' },
	{ name: 'ritu_en_medical', value: 'ritu_en_medical' },
	{ name: 'ritu_en_reels', value: 'ritu_en_reels' },
	{ name: 'ritu_hi_ads_formal', value: 'ritu_hi_ads_formal' },
	{ name: 'ritu_hi_ads_informal', value: 'ritu_hi_ads_informal' },
	{ name: 'ritu_hi_banking', value: 'ritu_hi_banking' },
	{ name: 'ritu_hi_conversation', value: 'ritu_hi_conversation' },
	{ name: 'ritu_hi_customer', value: 'ritu_hi_customer' },
	{ name: 'ritu_hi_customer_utility', value: 'ritu_hi_customer_utility' },
	{ name: 'ritu_hi_customer_warm', value: 'ritu_hi_customer_warm' },
	{ name: 'ritu_hi_edtech', value: 'ritu_hi_edtech' },
	{ name: 'ritu_hi_edtech_bot', value: 'ritu_hi_edtech_bot' },
	{ name: 'ritu_hi_insurance', value: 'ritu_hi_insurance' },
	{ name: 'ritu_hi_kids', value: 'ritu_hi_kids' },
	{ name: 'ritu_hi_medical', value: 'ritu_hi_medical' },
	{ name: 'ritu_hi_reels', value: 'ritu_hi_reels' },
	{ name: 'ritu_hi_sales', value: 'ritu_hi_sales' },
	{ name: 'ritu_hi_social', value: 'ritu_hi_social' },
	{ name: 'ritu_hi_social_lively', value: 'ritu_hi_social_lively' },
	{ name: 'ritu_mr_insurance', value: 'ritu_mr_insurance' },
	{ name: 'ritu_mr_narration', value: 'ritu_mr_narration' },
	{ name: 'rohan_en_recovery', value: 'rohan_en_recovery' },
	{ name: 'roopa_bn_conversational', value: 'roopa_bn_conversational' },
	{ name: 'roopa_en_conversational', value: 'roopa_en_conversational' },
	{ name: 'roopa_hi_companion', value: 'roopa_hi_companion' },
	{ name: 'roopa_hi_conversational', value: 'roopa_hi_conversational' },
	{ name: 'roopa_hi_market', value: 'roopa_hi_market' },
	{ name: 'roopa_hi_narration', value: 'roopa_hi_narration' },
	{ name: 'roopa_hi_recovery', value: 'roopa_hi_recovery' },
	{ name: 'rupali_mr_stories', value: 'rupali_mr_stories' },
	{ name: 'rustom_en_suspense', value: 'rustom_en_suspense' },
	{ name: 'sanchita_en_companion', value: 'sanchita_en_companion' },
	{ name: 'sanchita_en_insurance', value: 'sanchita_en_insurance' },
	{ name: 'sanchita_en_market', value: 'sanchita_en_market' },
	{ name: 'sanchita_en_recovery', value: 'sanchita_en_recovery' },
	{ name: 'sanchita_en_social', value: 'sanchita_en_social' },
	{ name: 'sanchita_enhi_companion', value: 'sanchita_enhi_companion' },
	{ name: 'sanchita_hi_ads_formal', value: 'sanchita_hi_ads_formal' },
	{ name: 'sanchita_hi_ads_informal', value: 'sanchita_hi_ads_informal' },
	{ name: 'sanchita_hi_assistant', value: 'sanchita_hi_assistant' },
	{ name: 'sanchita_hi_banking', value: 'sanchita_hi_banking' },
	{ name: 'sanchita_hi_edtech', value: 'sanchita_hi_edtech' },
	{ name: 'sanchita_hi_feedback', value: 'sanchita_hi_feedback' },
	{ name: 'sanchita_hi_interview', value: 'sanchita_hi_interview' },
	{ name: 'sanchita_hi_kyc', value: 'sanchita_hi_kyc' },
	{ name: 'sanchita_hi_market', value: 'sanchita_hi_market' },
	{ name: 'sanchita_hi_romantic', value: 'sanchita_hi_romantic' },
	{ name: 'sanchita_hi_social', value: 'sanchita_hi_social' },
	{ name: 'sarang_en_narration', value: 'sarang_en_narration' },
	{ name: 'sarika_hi_conversation', value: 'sarika_hi_conversation' },
	{ name: 'shabana_en_edtech', value: 'shabana_en_edtech' },
	{ name: 'shalini_en_companion', value: 'shalini_en_companion' },
	{ name: 'shalini_en_customer', value: 'shalini_en_customer' },
	{ name: 'shalini_enhi_companion', value: 'shalini_enhi_companion' },
	{ name: 'shalini_enhi_customer', value: 'shalini_enhi_customer' },
	{ name: 'shalini_hi_companion', value: 'shalini_hi_companion' },
	{ name: 'shalini_hi_social', value: 'shalini_hi_social' },
	{ name: 'shilpa_hi_narration', value: 'shilpa_hi_narration' },
	{ name: 'shreya_hi_conversational', value: 'shreya_hi_conversational' },
	{ name: 'shreya_hi_news', value: 'shreya_hi_news' },
	{ name: 'shruti_hi_edtech', value: 'shruti_hi_edtech' },
	{ name: 'shubh_en_ads', value: 'shubh_en_ads' },
	{ name: 'shubh_en_audiobook', value: 'shubh_en_audiobook' },
	{ name: 'shubh_en_narration', value: 'shubh_en_narration' },
	{ name: 'shubh_en_narration_gentle', value: 'shubh_en_narration_gentle' },
	{ name: 'shubh_en_numbers', value: 'shubh_en_numbers' },
	{ name: 'shubh_en_recovery', value: 'shubh_en_recovery' },
	{ name: 'shubh_en_sports', value: 'shubh_en_sports' },
	{ name: 'shubh_enhi_ads', value: 'shubh_enhi_ads' },
	{ name: 'shubh_enhi_banking', value: 'shubh_enhi_banking' },
	{ name: 'shubh_enhi_companion', value: 'shubh_enhi_companion' },
	{ name: 'shubh_hi_ads', value: 'shubh_hi_ads' },
	{ name: 'shubh_hi_customer', value: 'shubh_hi_customer' },
	{ name: 'shubh_hi_devotional', value: 'shubh_hi_devotional' },
	{ name: 'shubh_hi_ecomm', value: 'shubh_hi_ecomm' },
	{ name: 'shubh_hi_recovery', value: 'shubh_hi_recovery' },
	{ name: 'shubh_hi_stories_dramatic', value: 'shubh_hi_stories_dramatic' },
	{ name: 'shubh_hi_stories_mixed', value: 'shubh_hi_stories_mixed' },
	{ name: 'simran_en_ads', value: 'simran_en_ads' },
	{ name: 'simran_en_automobile', value: 'simran_en_automobile' },
	{ name: 'simran_en_conversation', value: 'simran_en_conversation' },
	{ name: 'simran_en_customer', value: 'simran_en_customer' },
	{ name: 'simran_en_edtech', value: 'simran_en_edtech' },
	{ name: 'simran_en_edtech_bot', value: 'simran_en_edtech_bot' },
	{ name: 'simran_en_narration', value: 'simran_en_narration' },
	{ name: 'simran_en_recovery', value: 'simran_en_recovery' },
	{ name: 'simran_en_sales', value: 'simran_en_sales' },
	{ name: 'simran_en_therapist', value: 'simran_en_therapist' },
	{ name: 'simran_enhi_banking_expressive', value: 'simran_enhi_banking_expressive' },
	{ name: 'simran_enhi_companion', value: 'simran_enhi_companion' },
	{ name: 'simran_enhi_customer', value: 'simran_enhi_customer' },
	{ name: 'simran_hi_assistant', value: 'simran_hi_assistant' },
	{ name: 'simran_hi_automobile', value: 'simran_hi_automobile' },
	{ name: 'simran_hi_conversation', value: 'simran_hi_conversation' },
	{ name: 'simran_hi_latenight', value: 'simran_hi_latenight' },
	{ name: 'simran_hi_narration', value: 'simran_hi_narration' },
	{ name: 'simran_hi_news', value: 'simran_hi_news' },
	{ name: 'simran_hi_news_breaking', value: 'simran_hi_news_breaking' },
	{ name: 'simran_hi_recovery', value: 'simran_hi_recovery' },
	{ name: 'simran_hi_sales', value: 'simran_hi_sales' },
	{ name: 'simran_hi_social_energetic', value: 'simran_hi_social_energetic' },
	{ name: 'simran_hi_social_excited', value: 'simran_hi_social_excited' },
	{ name: 'soham_mr_narration', value: 'soham_mr_narration' },
	{ name: 'sophia_en_conversational', value: 'sophia_en_conversational' },
	{ name: 'suchitra_hi_ecomm', value: 'suchitra_hi_ecomm' },
	{ name: 'suchitra_kn_narration', value: 'suchitra_kn_narration' },
	{ name: 'suhani_hi_social', value: 'suhani_hi_social' },
	{ name: 'suman_hi_companion', value: 'suman_hi_companion' },
	{ name: 'sumit_hi_conversational', value: 'sumit_hi_conversational' },
	{ name: 'sunny_en_social', value: 'sunny_en_social' },
	{ name: 'sunny_enhi_customer', value: 'sunny_enhi_customer' },
	{ name: 'sunny_hi_ads', value: 'sunny_hi_ads' },
	{ name: 'sunny_hi_reels', value: 'sunny_hi_reels' },
	{ name: 'tanya_hi_narration', value: 'tanya_hi_narration' },
	{ name: 'tarun_hi_conversational', value: 'tarun_hi_conversational' },
	{ name: 'tarun_hi_sales', value: 'tarun_hi_sales' },
	{ name: 'tarun_te_narration', value: 'tarun_te_narration' },
	{ name: 'vaibhav_hi_social', value: 'vaibhav_hi_social' },
	{ name: 'vandana_hi_ecomm', value: 'vandana_hi_ecomm' },
	{ name: 'varun_en_ads', value: 'varun_en_ads' },
	{ name: 'varun_en_suspense', value: 'varun_en_suspense' },
	{ name: 'vijay_ta_narration', value: 'vijay_ta_narration' },
	{ name: 'vipul_hi_social', value: 'vipul_hi_social' },
	{ name: 'zarina_en_conversation', value: 'zarina_en_conversation' },
];

export class Sarvam implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Sarvam AI',
		name: 'sarvam',
		icon: 'file:sarvam.svg',
		group: ['transform'],
		usableAsTool: true,
		version: 1,
		subtitle: '={{$parameter["operation"] + " (" + $parameter["resource"] + ")"}}',
		description: 'Indian language AI APIs — transcribe, speak, and chat across 22+ Indian languages',
		defaults: {
			name: 'Sarvam AI',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'sarvamApi',
				required: true,
			},
		],
		properties: [
			// ──────────────── Resource ────────────────
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Chat', value: 'chat' },
					{ name: 'Speech', value: 'speech' },
				],
				default: 'speech',
			},

			// ──────────────── Operations ────────────────
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['speech'] } },
				options: [
					{ name: 'Speech to Text', value: 'speechToText', description: 'Transcribe audio to text with multiple output modes', action: 'Speech to text' },
					{ name: 'Text to Speech', value: 'textToSpeech', description: 'Convert text to spoken audio', action: 'Text to speech' },
				],
				default: 'speechToText',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['chat'] } },
				options: [
					{ name: 'Complete', value: 'complete', description: 'Generate a chat completion', action: 'Complete chat' },
				],
				default: 'complete',
			},

			// ════════════════ SPEECH > SPEECH TO TEXT ════════════════
			{
				displayName: 'Input Binary Field',
				name: 'binaryPropertyName',
				type: 'string',
				required: true,
				default: 'data',
				displayOptions: { show: { resource: ['speech'], operation: ['speechToText'] } },
				description: 'Name of the binary property containing the audio file',
			},
			{
				displayName: 'Mode',
				name: 'sttMode',
				type: 'options',
				required: true,
				default: 'transcribe',
				options: [
					{ name: 'Code Mixed', value: 'codemix', description: 'English words in English, Indic words in native script' },
					{ name: 'Transcribe', value: 'transcribe', description: 'Standard transcription in original language' },
					{ name: 'Translate to English', value: 'translate', description: 'Translate speech from any Indic language to English' },
					{ name: 'Transliterate (Roman)', value: 'translit', description: 'Romanize speech to Latin script' },
					{ name: 'Verbatim', value: 'verbatim', description: 'Exact word-for-word transcription without normalization' },
				],
				displayOptions: { show: { resource: ['speech'], operation: ['speechToText'] } },
			},
			{
				displayName: 'Model',
				name: 'sttModel',
				type: 'options',
				default: 'saaras:v4',
				options: [
					{ name: 'Saaras V4', value: 'saaras:v4', description: 'Latest and recommended; supports key terms' },
					{ name: 'Saaras V3', value: 'saaras:v3', description: 'Previous version, still available' },
				],
				displayOptions: { show: { resource: ['speech'], operation: ['speechToText'] } },
			},
			{
				displayName: 'Options',
				name: 'speechToTextOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: { show: { resource: ['speech'], operation: ['speechToText'] } },
				options: [
					{
						displayName: 'Key Terms',
						name: 'keyterms',
						type: 'string',
						default: '',
						placeholder: 'Sarvam, New Delhi',
						description: 'Comma-separated terms (max 50, 64 characters each) to bias recognition. Saaras V4 only.',
					},
					{
						displayName: 'Timestamps',
						name: 'with_timestamps',
						type: 'boolean',
						default: false,
						description: 'Whether to return chunk-level timestamps',
					},
					{
						displayName: 'Language',
						name: 'language_code',
						type: 'options',
						default: 'unknown',
						options: STT_LANGUAGES,
						description: 'Language of the audio. Use Auto Detect if unknown.',
					},
				],
			},

			// ════════════════ SPEECH > TEXT TO SPEECH ════════════════
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				typeOptions: { rows: 4 },
				required: true,
				default: '',
				displayOptions: { show: { resource: ['speech'], operation: ['textToSpeech'] } },
				description: 'The text to convert to speech (max 2500 characters)',
			},
			{
				displayName: 'Model',
				name: 'ttsModel',
				type: 'options',
				default: 'bulbul:v4-flash',
				options: [
					{ name: 'Bulbul V4 Flash', value: 'bulbul:v4-flash', description: 'Latest model with 200+ persona voices' },
					{ name: 'Bulbul V3 (Ends Nov 10, 2026)', value: 'bulbul:v3', description: 'Legacy model with classic speakers' },
				],
				displayOptions: { show: { resource: ['speech'], operation: ['textToSpeech'] } },
			},
			{
				displayName: 'Speaker',
				name: 'ttsSpeakerV3',
				type: 'options',
				default: 'shubh',
				options: TTS_SPEAKERS,
				displayOptions: { show: { resource: ['speech'], operation: ['textToSpeech'], ttsModel: ['bulbul:v3'] } },
				description: 'Voice to use for synthesis',
			},
			{
				displayName: 'Speaker',
				name: 'ttsSpeakerV4',
				type: 'options',
				default: 'shubh_enhi_ads',
				options: TTS_SPEAKERS_V4,
				displayOptions: { show: { resource: ['speech'], operation: ['textToSpeech'], ttsModel: ['bulbul:v4-flash'] } },
				description: 'Persona voice in the form name_language_style. V3 speaker names are not valid for V4 Flash.',
			},
			{
				displayName: 'Target Language',
				name: 'ttsTargetLanguage',
				type: 'options',
				required: true,
				default: 'hi-IN',
				options: TTS_LANGUAGES,
				displayOptions: { show: { resource: ['speech'], operation: ['textToSpeech'] } },
				description: 'Language for text normalization before synthesis',
			},
			{
				displayName: 'Options',
				name: 'textToSpeechOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: { show: { resource: ['speech'], operation: ['textToSpeech'] } },
				options: [
					{
						displayName: 'Output Audio Codec',
						name: 'output_audio_codec',
						type: 'options',
						default: 'wav',
						options: [
							{ name: 'AAC', value: 'aac' },
							{ name: 'ALAW', value: 'alaw' },
							{ name: 'FLAC', value: 'flac' },
							{ name: 'Linear16', value: 'linear16' },
							{ name: 'MP3', value: 'mp3' },
							{ name: 'MULAW', value: 'mulaw' },
							{ name: 'Opus', value: 'opus', description: 'Requires a sample rate of 8000, 16000, 24000 or 48000 Hz' },
							{ name: 'WAV', value: 'wav' },
						],
					},
					{
						displayName: 'Pace',
						name: 'pace',
						type: 'number',
						default: 1,
						typeOptions: { minValue: 0.5, maxValue: 2, numberPrecision: 1 },
						description: 'Speech speed (0.5-2.0)',
					},
					{
						displayName: 'Sample Rate',
						name: 'speech_sample_rate',
						type: 'options',
						default: 22050,
						options: [
							{ name: '8000 Hz', value: 8000 },
							{ name: '16000 Hz', value: 16000 },
							{ name: '22050 Hz', value: 22050 },
							{ name: '24000 Hz', value: 24000 },
							{ name: '32000 Hz', value: 32000 },
							{ name: '44100 Hz', value: 44100 },
							{ name: '48000 Hz', value: 48000 },
						],
					},
					{
						displayName: 'Temperature',
						name: 'temperature',
						type: 'number',
						default: 0.6,
						typeOptions: { minValue: 0.01, maxValue: 1, numberPrecision: 2 },
						description: 'Expressiveness control (0.01-1.0)',
					},
				],
			},

			// ════════════════ CHAT > COMPLETE ════════════════
			{
				displayName: 'Model',
				name: 'chatModel',
				type: 'options',
				required: true,
				default: 'sarvam-105b',
				options: [
					{ name: 'Sarvam 105B', value: 'sarvam-105b', description: '128K context; complex reasoning and agentic tasks' },
					{ name: 'Sarvam 105B Conversations', value: 'sarvam-105b-conversations', description: '32K context; real-time dialogue and voice agents' },
				],
				displayOptions: { show: { resource: ['chat'], operation: ['complete'] } },
			},
			{
				displayName: 'User Message',
				name: 'userMessage',
				type: 'string',
				typeOptions: { rows: 4 },
				required: true,
				default: '',
				displayOptions: { show: { resource: ['chat'], operation: ['complete'] } },
				description: 'The message to send to the model',
			},
			{
				displayName: 'System Message',
				name: 'systemMessage',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				displayOptions: { show: { resource: ['chat'], operation: ['complete'] } },
				description: 'Optional system prompt to guide the model behavior',
			},
			{
				displayName: 'Options',
				name: 'chatOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: { show: { resource: ['chat'], operation: ['complete'] } },
				options: [
					{
						displayName: 'Frequency Penalty',
						name: 'frequency_penalty',
						type: 'number',
						default: 0,
						typeOptions: { minValue: -2, maxValue: 2 },
						description: 'Penalize repeated tokens (-2.0 to 2.0)',
					},
					{
						displayName: 'Max Tokens',
						name: 'max_tokens',
						type: 'number',
						default: 4096,
						typeOptions: { minValue: 1 },
						description: 'Reasoning tokens count toward this limit. Raise it or disable reasoning if answers come back empty.',
					},
					{
						displayName: 'Presence Penalty',
						name: 'presence_penalty',
						type: 'number',
						default: 0,
						typeOptions: { minValue: -2, maxValue: 2 },
						description: 'Encourage new topics (-2.0 to 2.0)',
					},
					{
						displayName: 'Reasoning Effort',
						name: 'reasoning_effort',
						type: 'options',
						default: '',
						options: [
							{ name: 'API Default (Medium)', value: '' },
							{ name: 'Disabled', value: 'none', description: 'Turn thinking off' },
							{ name: 'High', value: 'high' },
							{ name: 'Low', value: 'low' },
							{ name: 'Medium', value: 'medium' },
						],
					},
					{
						displayName: 'Seed',
						name: 'seed',
						type: 'number',
						default: 0,
						description: 'For reproducible results (best effort)',
					},
					{
						displayName: 'Temperature',
						name: 'temperature',
						type: 'number',
						default: 0.2,
						typeOptions: { minValue: 0, maxValue: 2, numberPrecision: 1 },
					},
					{
						displayName: 'Top P',
						name: 'top_p',
						type: 'number',
						default: 1,
						typeOptions: { minValue: 0, maxValue: 1, numberPrecision: 2 },
					},
					{
						displayName: 'Wiki Grounding',
						name: 'wiki_grounding',
						type: 'boolean',
						default: false,
						description: 'Whether to ground responses using Wikipedia',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject;

				if (resource === 'speech') {
					const result = await handleSpeechOperations.call(this, operation, i);
				if (operation === 'textToSpeech') {
					returnData.push({ ...(result as unknown as INodeExecutionData), pairedItem: { item: i } });
					continue;
					}
					responseData = result;
				} else if (resource === 'chat') {
					responseData = await handleChatOperations.call(this, i);
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`);
				}

			returnData.push({ json: responseData, pairedItem: { item: i } });
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

async function handleSpeechOperations(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject> {
	if (operation === 'speechToText') {
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
		const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
		const dataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

		const extraFields: IDataObject = {
			model: this.getNodeParameter('sttModel', i, 'saaras:v4') as string,
			mode: this.getNodeParameter('sttMode', i) as string,
		};

		const options = this.getNodeParameter('speechToTextOptions', i, {}) as IDataObject;
		if (options.language_code) extraFields.language_code = options.language_code;
		if (options.with_timestamps) extraFields.with_timestamps = 'true';
		if (options.keyterms) {
			if (extraFields.model !== 'saaras:v4') {
				throw new NodeOperationError(this.getNode(), 'Key Terms are only supported with Saaras V4. Switch the Model to Saaras V4.');
			}
			const terms = String(options.keyterms).split(',').map((t) => t.trim()).filter(Boolean);
			if (terms.length > 50) {
				throw new NodeOperationError(this.getNode(), 'Key Terms accepts at most 50 terms.');
			}
			extraFields.keyterms = JSON.stringify(terms);
		}

		return await makeFormRequest.call(
			this, '/speech-to-text', dataBuffer,
			binaryData.fileName ?? 'audio.wav', binaryData.mimeType ?? 'audio/wav', extraFields,
		);
	}

	if (operation === 'textToSpeech') {
		const ttsModel = this.getNodeParameter('ttsModel', i, 'bulbul:v4-flash') as string;
		const body: IDataObject = {
			model: ttsModel,
			text: this.getNodeParameter('text', i) as string,
			language_code: this.getNodeParameter('ttsTargetLanguage', i) as string,
		};
		const speaker = this.getNodeParameter(
			ttsModel === 'bulbul:v3' ? 'ttsSpeakerV3' : 'ttsSpeakerV4',
			i,
			'',
		) as string;
		if (speaker) body.speaker = speaker.trim();
		const options = this.getNodeParameter('textToSpeechOptions', i, {}) as IDataObject;
		if (options.pace !== undefined) body.pace = options.pace;
		if (options.temperature !== undefined) body.temperature = options.temperature;
		if (options.speech_sample_rate) body.speech_sample_rate = options.speech_sample_rate;
		if (options.output_audio_codec) body.output_audio_codec = options.output_audio_codec;

		if (options.output_audio_codec === 'opus') {
			const opusRates = [8000, 16000, 24000, 48000];
			if (body.speech_sample_rate === undefined) {
				body.speech_sample_rate = 24000;
			} else if (!opusRates.includes(body.speech_sample_rate as number)) {
				throw new NodeOperationError(this.getNode(), 'Opus requires a sample rate of 8000, 16000, 24000 or 48000 Hz.');
			}
		}

		const response = (await makeApiRequest.call(this, 'POST', '/text-to-speech', body)) as IDataObject & {
			audios?: string[];
		};

		const codec = (options.output_audio_codec as string) ?? 'wav';
		const mimeTypes: Record<string, string> = {
			wav: 'audio/wav',
			mp3: 'audio/mpeg',
			aac: 'audio/aac',
			flac: 'audio/flac',
			linear16: 'audio/L16',
			opus: 'audio/opus',
			mulaw: 'audio/basic',
			alaw: 'audio/basic',
		};

		if (response.audios && Array.isArray(response.audios) && response.audios.length > 0) {
			const audioBuffer = Buffer.from(response.audios[0] as string, 'base64');
			const binaryOutput = await this.helpers.prepareBinaryData(
				audioBuffer,
				`output.${codec}`,
				mimeTypes[codec] ?? 'audio/wav',
			);
			return { json: { request_id: response.request_id }, binary: { data: binaryOutput } } as unknown as IDataObject;
		}

		return response;
	}

	throw new NodeOperationError(this.getNode(), `Unknown speech operation: ${operation}`);
}

async function handleChatOperations(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject> {
	const model = this.getNodeParameter('chatModel', i) as string;
	const userMessage = this.getNodeParameter('userMessage', i) as string;
	const systemMessage = this.getNodeParameter('systemMessage', i, '') as string;
	const options = this.getNodeParameter('chatOptions', i, {}) as IDataObject;

	const messages: Array<{ role: string; content: string }> = [];
	if (systemMessage) {
		messages.push({ role: 'system', content: systemMessage });
	}
	messages.push({ role: 'user', content: userMessage });

	const body: IDataObject = { model, messages };
	if (options.temperature !== undefined) body.temperature = options.temperature;
	if (options.top_p !== undefined) body.top_p = options.top_p;
	if (options.max_tokens) body.max_tokens = options.max_tokens;
	if (options.frequency_penalty !== undefined) body.frequency_penalty = options.frequency_penalty;
	if (options.presence_penalty !== undefined) body.presence_penalty = options.presence_penalty;
	if (options.wiki_grounding !== undefined) body.wiki_grounding = options.wiki_grounding;
	if (options.seed) body.seed = options.seed;
	if (options.reasoning_effort === 'none') body.reasoning_effort = null;
	else if (options.reasoning_effort) body.reasoning_effort = options.reasoning_effort;

	return await makeApiRequest.call(this, 'POST', '/v1/chat/completions', body);
}

function formatApiError(error: unknown): string {
	const err = error as { statusCode?: number; message?: string; body?: { error?: { message?: string }; detail?: string } };
	const status = err.statusCode;
	const apiMessage = err.body?.error?.message ?? err.body?.detail ?? err.message ?? 'Unknown error';

	if (status === 401 || status === 403) {
		return 'Invalid or expired API key. Check your Sarvam AI credential.';
	}
	if (status === 402 || apiMessage.includes('insufficient_quota')) {
		return 'Insufficient API credits. Top up at dashboard.sarvam.ai.';
	}
	if (status === 422) {
		return `Invalid request: ${apiMessage}`;
	}
	if (status === 429) {
		return 'Rate limit exceeded. Please wait and try again.';
	}
	if (status && status >= 500) {
		return `Sarvam API server error (${status}). Try again later.`;
	}
	return apiMessage;
}

async function makeApiRequest(
	this: IExecuteFunctions,
	method: string,
	endpoint: string,
	body: IDataObject,
): Promise<IDataObject> {
	try {
		return (await this.helpers.httpRequestWithAuthentication.call(this, 'sarvamApi', {
			method: method as 'POST',
			url: `${BASE_URL}${endpoint}`,
			body,
			json: true,
			headers: {
				'Content-Type': 'application/json',
			},
		})) as IDataObject;
	} catch (error) {
		throw new NodeOperationError(this.getNode(), formatApiError(error));
	}
}

async function makeFormRequest(
	this: IExecuteFunctions,
	endpoint: string,
	fileBuffer: Buffer,
	fileName: string,
	mimeType: string,
	extraFields: IDataObject,
): Promise<IDataObject> {
	const boundary = `----n8nBoundary${Date.now()}`;
	const parts: Buffer[] = [];

	parts.push(Buffer.from(
		`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: ${mimeType}\r\n\r\n`,
	));
	parts.push(fileBuffer);
	parts.push(Buffer.from('\r\n'));

	for (const [key, value] of Object.entries(extraFields)) {
		if (value !== undefined && value !== null && value !== '') {
			parts.push(Buffer.from(
				`--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${String(value)}\r\n`,
			));
		}
	}

	parts.push(Buffer.from(`--${boundary}--\r\n`));
	const body = Buffer.concat(parts);

	try {
		return (await this.helpers.httpRequestWithAuthentication.call(this, 'sarvamApi', {
			method: 'POST',
			url: `${BASE_URL}${endpoint}`,
			body,
			headers: {
				'Content-Type': `multipart/form-data; boundary=${boundary}`,
			},
		})) as IDataObject;
	} catch (error) {
		throw new NodeOperationError(this.getNode(), formatApiError(error));
	}
}
