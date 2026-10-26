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
	{ name: 'Aarti - Hindi - Customer', value: 'aarti_hi_customer' },
	{ name: 'Aayan - Hindi - Conversational', value: 'aayan_hi_conversational' },
	{ name: 'Aditi - English - Stories', value: 'aditi_en_stories' },
	{ name: 'Aditya - Hindi - Conversational', value: 'aditya_hi_conversational' },
	{ name: 'Aditya - Hindi - Sales', value: 'aditya_hi_sales' },
	{ name: 'Advait - Hindi - Character', value: 'advait_hi_character' },
	{ name: 'Amelia - English - Conversational', value: 'amelia_en_conversational' },
	{ name: 'Amit - Hindi - Conversational', value: 'amit_hi_conversational' },
	{ name: 'Anand - Hindi - Documentary', value: 'anand_hi_documentary' },
	{ name: 'Anand - Hindi - News', value: 'anand_hi_news' },
	{ name: 'Anand - Punjabi - Conversation', value: 'anand_pa_conversation' },
	{ name: 'Anand - Punjabi - Customer', value: 'anand_pa_customer' },
	{ name: 'Aparna - English - Companion', value: 'aparna_en_companion' },
	{ name: 'Aparna - English - Edtech', value: 'aparna_en_edtech' },
	{ name: 'Aparna - Hindi - Customer', value: 'aparna_hi_customer' },
	{ name: 'Aparna - Hindi - Kyc', value: 'aparna_hi_kyc' },
	{ name: 'Aravind - Tamil - Ads', value: 'aravind_ta_ads' },
	{ name: 'Aravind - Tamil - Suspense', value: 'aravind_ta_suspense' },
	{ name: 'Arnab - Bengali - Conversation', value: 'arnab_bn_conversation' },
	{ name: 'Aryaman - Hindi - Ads', value: 'aryaman_hi_ads' },
	{ name: 'Ashok - Hindi - Character', value: 'ashok_hi_character' },
	{ name: 'Ashok - Hindi - News', value: 'ashok_hi_news' },
	{ name: 'Ashutosh - Hindi - Conversational', value: 'ashutosh_hi_conversational' },
	{ name: 'Ashwin - English - Sports', value: 'ashwin_en_sports' },
	{ name: 'Ashwin - English - Sports Energetic', value: 'ashwin_en_sports_energetic' },
	{ name: 'Bhavik - Gujarati - Conversation', value: 'bhavik_gu_conversation' },
	{ name: 'Bimal - Bengali - Suspense', value: 'bimal_bn_suspense' },
	{ name: 'Chaitra - Hindi - Customer', value: 'chaitra_hi_customer' },
	{ name: 'Chaitra - Kannada - Conversation', value: 'chaitra_kn_conversation' },
	{ name: 'Chaitra - Kannada - Narration', value: 'chaitra_kn_narration' },
	{ name: 'Chandrika - English - Stories', value: 'chandrika_en_stories' },
	{ name: 'Chetan - Kannada - Conversation', value: 'chetan_kn_conversation' },
	{ name: 'Chhavi - Hindi - Kids', value: 'chhavi_hi_kids' },
	{ name: 'Chirag - Hindi - Social', value: 'chirag_hi_social' },
	{ name: 'Dev - English - Conversational', value: 'dev_en_conversational' },
	{ name: 'Dev - English - Recovery', value: 'dev_en_recovery' },
	{ name: 'Deven - English - Conversation', value: 'deven_en_conversation' },
	{ name: 'Girish - English - Devotional', value: 'girish_en_devotional' },
	{ name: 'Girish - English - Documentary', value: 'girish_en_documentary' },
	{ name: 'Girish - Hindi - Devotional', value: 'girish_hi_devotional' },
	{ name: 'Gokul - Tamil - Narration', value: 'gokul_ta_narration' },
	{ name: 'Harpreet - Punjabi - Narration', value: 'harpreet_pa_narration' },
	{ name: 'Ishita - English - Customer', value: 'ishita_en_customer' },
	{ name: 'Ishita - English - Medical', value: 'ishita_en_medical' },
	{ name: 'Ishita - English - Numbers', value: 'ishita_en_numbers' },
	{ name: 'Ishita - English - Social', value: 'ishita_en_social' },
	{ name: 'Ishita - English - Stories', value: 'ishita_en_stories' },
	{ name: 'Ishita - English-Hindi - Companion', value: 'ishita_enhi_companion' },
	{ name: 'Ishita - English-Hindi - Customer', value: 'ishita_enhi_customer' },
	{ name: 'Ishita - English-Hindi - Customer Expressive', value: 'ishita_enhi_customer_expressive' },
	{ name: 'Ishita - Hindi - Ads', value: 'ishita_hi_ads' },
	{ name: 'Ishita - Hindi - Ads Informal', value: 'ishita_hi_ads_informal' },
	{ name: 'Ishita - Hindi - Banking', value: 'ishita_hi_banking' },
	{ name: 'Ishita - Hindi - Devotional', value: 'ishita_hi_devotional' },
	{ name: 'Ishita - Hindi - Edtech', value: 'ishita_hi_edtech' },
	{ name: 'Ishita - Hindi - Numbers', value: 'ishita_hi_numbers' },
	{ name: 'Ishita - Hindi - Social', value: 'ishita_hi_social' },
	{ name: 'Ishita - Marathi - Conversational', value: 'ishita_mr_conversational' },
	{ name: 'Jaspal - Punjabi - Banking', value: 'jaspal_pa_banking' },
	{ name: 'Kabir - Hindi - Conversational', value: 'kabir_hi_conversational' },
	{ name: 'Kalpit - English - Edtech', value: 'kalpit_en_edtech' },
	{ name: 'Kavitha - Telugu - Conversation', value: 'kavitha_te_conversation' },
	{ name: 'Kavitha - Telugu - Narration', value: 'kavitha_te_narration' },
	{ name: 'Kavya - Hindi - Conversational', value: 'kavya_hi_conversational' },
	{ name: 'Kunal - Hindi - Kids', value: 'kunal_hi_kids' },
	{ name: 'Mahesh - Hindi - Documentary', value: 'mahesh_hi_documentary' },
	{ name: 'Manan - Hindi - Conversational', value: 'manan_hi_conversational' },
	{ name: 'Mani - Hindi - Conversational', value: 'mani_hi_conversational' },
	{ name: 'Mani - Hindi - Devotional', value: 'mani_hi_devotional' },
	{ name: 'Mohit - Hindi - Conversational', value: 'mohit_hi_conversational' },
	{ name: 'Mrunal - Marathi - Narration', value: 'mrunal_mr_narration' },
	{ name: 'Mukul - Hindi - Ads', value: 'mukul_hi_ads' },
	{ name: 'Mukul - Hindi - Suspense', value: 'mukul_hi_suspense' },
	{ name: 'Mukul - Marathi - Stories', value: 'mukul_mr_stories' },
	{ name: 'Nachiket - English - Ads', value: 'nachiket_en_ads' },
	{ name: 'Nachiket - Hindi - Devotional', value: 'nachiket_hi_devotional' },
	{ name: 'Neha - English - Customer', value: 'neha_en_customer' },
	{ name: 'Neha - English - Latenight', value: 'neha_en_latenight' },
	{ name: 'Neha - Marathi - Narration', value: 'neha_mr_narration' },
	{ name: 'Nilesh - Marathi - Conversation', value: 'nilesh_mr_conversation' },
	{ name: 'Nupur - English - Kids', value: 'nupur_en_kids' },
	{ name: 'Ojas - English - Social', value: 'ojas_en_social' },
	{ name: 'Payal - English - Edtech', value: 'payal_en_edtech' },
	{ name: 'Pooja - Gujarati - Conversational', value: 'pooja_gu_conversational' },
	{ name: 'Pooja - Gujarati - Customer', value: 'pooja_gu_customer' },
	{ name: 'Pooja - Telugu - Conversation', value: 'pooja_te_conversation' },
	{ name: 'Priya - Hindi - Recovery', value: 'priya_hi_recovery' },
	{ name: 'Rahul - Hindi - Conversational', value: 'rahul_hi_conversational' },
	{ name: 'Ratan - Hindi - Customer Expressive', value: 'ratan_hi_customer_expressive' },
	{ name: 'Ratan - Hindi - Devotional', value: 'ratan_hi_devotional' },
	{ name: 'Ratan - Hindi - Documentary', value: 'ratan_hi_documentary' },
	{ name: 'Ratan - Hindi - Latenight', value: 'ratan_hi_latenight' },
	{ name: 'Ratan - Hindi - Latenight Warm', value: 'ratan_hi_latenight_warm' },
	{ name: 'Ratan - Hindi - Recovery', value: 'ratan_hi_recovery' },
	{ name: 'Ratan - Hindi - Social', value: 'ratan_hi_social' },
	{ name: 'Ratan - Hindi - Sports', value: 'ratan_hi_sports' },
	{ name: 'Rehan - Hindi - Social', value: 'rehan_hi_social' },
	{ name: 'Ritu - English - Edtech', value: 'ritu_en_edtech' },
	{ name: 'Ritu - English - Latenight', value: 'ritu_en_latenight' },
	{ name: 'Ritu - English - Medical', value: 'ritu_en_medical' },
	{ name: 'Ritu - English - Reels', value: 'ritu_en_reels' },
	{ name: 'Ritu - Hindi - Ads Formal', value: 'ritu_hi_ads_formal' },
	{ name: 'Ritu - Hindi - Ads Informal', value: 'ritu_hi_ads_informal' },
	{ name: 'Ritu - Hindi - Banking', value: 'ritu_hi_banking' },
	{ name: 'Ritu - Hindi - Conversation', value: 'ritu_hi_conversation' },
	{ name: 'Ritu - Hindi - Customer', value: 'ritu_hi_customer' },
	{ name: 'Ritu - Hindi - Customer Utility', value: 'ritu_hi_customer_utility' },
	{ name: 'Ritu - Hindi - Customer Warm', value: 'ritu_hi_customer_warm' },
	{ name: 'Ritu - Hindi - Edtech', value: 'ritu_hi_edtech' },
	{ name: 'Ritu - Hindi - Edtech Bot', value: 'ritu_hi_edtech_bot' },
	{ name: 'Ritu - Hindi - Insurance', value: 'ritu_hi_insurance' },
	{ name: 'Ritu - Hindi - Kids', value: 'ritu_hi_kids' },
	{ name: 'Ritu - Hindi - Medical', value: 'ritu_hi_medical' },
	{ name: 'Ritu - Hindi - Reels', value: 'ritu_hi_reels' },
	{ name: 'Ritu - Hindi - Sales', value: 'ritu_hi_sales' },
	{ name: 'Ritu - Hindi - Social', value: 'ritu_hi_social' },
	{ name: 'Ritu - Hindi - Social Lively', value: 'ritu_hi_social_lively' },
	{ name: 'Ritu - Marathi - Insurance', value: 'ritu_mr_insurance' },
	{ name: 'Ritu - Marathi - Narration', value: 'ritu_mr_narration' },
	{ name: 'Rohan - English - Recovery', value: 'rohan_en_recovery' },
	{ name: 'Roopa - Bengali - Conversational', value: 'roopa_bn_conversational' },
	{ name: 'Roopa - English - Conversational', value: 'roopa_en_conversational' },
	{ name: 'Roopa - Hindi - Companion', value: 'roopa_hi_companion' },
	{ name: 'Roopa - Hindi - Conversational', value: 'roopa_hi_conversational' },
	{ name: 'Roopa - Hindi - Market', value: 'roopa_hi_market' },
	{ name: 'Roopa - Hindi - Narration', value: 'roopa_hi_narration' },
	{ name: 'Roopa - Hindi - Recovery', value: 'roopa_hi_recovery' },
	{ name: 'Rupali - Marathi - Stories', value: 'rupali_mr_stories' },
	{ name: 'Rustom - English - Suspense', value: 'rustom_en_suspense' },
	{ name: 'Sanchita - English - Companion', value: 'sanchita_en_companion' },
	{ name: 'Sanchita - English - Insurance', value: 'sanchita_en_insurance' },
	{ name: 'Sanchita - English - Market', value: 'sanchita_en_market' },
	{ name: 'Sanchita - English - Recovery', value: 'sanchita_en_recovery' },
	{ name: 'Sanchita - English - Social', value: 'sanchita_en_social' },
	{ name: 'Sanchita - English-Hindi - Companion', value: 'sanchita_enhi_companion' },
	{ name: 'Sanchita - Hindi - Ads Formal', value: 'sanchita_hi_ads_formal' },
	{ name: 'Sanchita - Hindi - Ads Informal', value: 'sanchita_hi_ads_informal' },
	{ name: 'Sanchita - Hindi - Assistant', value: 'sanchita_hi_assistant' },
	{ name: 'Sanchita - Hindi - Banking', value: 'sanchita_hi_banking' },
	{ name: 'Sanchita - Hindi - Edtech', value: 'sanchita_hi_edtech' },
	{ name: 'Sanchita - Hindi - Feedback', value: 'sanchita_hi_feedback' },
	{ name: 'Sanchita - Hindi - Interview', value: 'sanchita_hi_interview' },
	{ name: 'Sanchita - Hindi - Kyc', value: 'sanchita_hi_kyc' },
	{ name: 'Sanchita - Hindi - Market', value: 'sanchita_hi_market' },
	{ name: 'Sanchita - Hindi - Romantic', value: 'sanchita_hi_romantic' },
	{ name: 'Sanchita - Hindi - Social', value: 'sanchita_hi_social' },
	{ name: 'Sarang - English - Narration', value: 'sarang_en_narration' },
	{ name: 'Sarika - Hindi - Conversation', value: 'sarika_hi_conversation' },
	{ name: 'Shabana - English - Edtech', value: 'shabana_en_edtech' },
	{ name: 'Shalini - English - Companion', value: 'shalini_en_companion' },
	{ name: 'Shalini - English - Customer', value: 'shalini_en_customer' },
	{ name: 'Shalini - English-Hindi - Companion', value: 'shalini_enhi_companion' },
	{ name: 'Shalini - English-Hindi - Customer', value: 'shalini_enhi_customer' },
	{ name: 'Shalini - Hindi - Companion', value: 'shalini_hi_companion' },
	{ name: 'Shalini - Hindi - Social', value: 'shalini_hi_social' },
	{ name: 'Shilpa - Hindi - Narration', value: 'shilpa_hi_narration' },
	{ name: 'Shreya - Hindi - Conversational', value: 'shreya_hi_conversational' },
	{ name: 'Shreya - Hindi - News', value: 'shreya_hi_news' },
	{ name: 'Shruti - Hindi - Edtech', value: 'shruti_hi_edtech' },
	{ name: 'Shubh - English - Ads', value: 'shubh_en_ads' },
	{ name: 'Shubh - English - Audiobook', value: 'shubh_en_audiobook' },
	{ name: 'Shubh - English - Narration', value: 'shubh_en_narration' },
	{ name: 'Shubh - English - Narration Gentle', value: 'shubh_en_narration_gentle' },
	{ name: 'Shubh - English - Numbers', value: 'shubh_en_numbers' },
	{ name: 'Shubh - English - Recovery', value: 'shubh_en_recovery' },
	{ name: 'Shubh - English - Sports', value: 'shubh_en_sports' },
	{ name: 'Shubh - English-Hindi - Ads', value: 'shubh_enhi_ads' },
	{ name: 'Shubh - English-Hindi - Banking', value: 'shubh_enhi_banking' },
	{ name: 'Shubh - English-Hindi - Companion', value: 'shubh_enhi_companion' },
	{ name: 'Shubh - Hindi - Ads', value: 'shubh_hi_ads' },
	{ name: 'Shubh - Hindi - Customer', value: 'shubh_hi_customer' },
	{ name: 'Shubh - Hindi - Devotional', value: 'shubh_hi_devotional' },
	{ name: 'Shubh - Hindi - Ecomm', value: 'shubh_hi_ecomm' },
	{ name: 'Shubh - Hindi - Recovery', value: 'shubh_hi_recovery' },
	{ name: 'Shubh - Hindi - Stories Dramatic', value: 'shubh_hi_stories_dramatic' },
	{ name: 'Shubh - Hindi - Stories Mixed', value: 'shubh_hi_stories_mixed' },
	{ name: 'Simran - English - Ads', value: 'simran_en_ads' },
	{ name: 'Simran - English - Automobile', value: 'simran_en_automobile' },
	{ name: 'Simran - English - Conversation', value: 'simran_en_conversation' },
	{ name: 'Simran - English - Customer', value: 'simran_en_customer' },
	{ name: 'Simran - English - Edtech', value: 'simran_en_edtech' },
	{ name: 'Simran - English - Edtech Bot', value: 'simran_en_edtech_bot' },
	{ name: 'Simran - English - Narration', value: 'simran_en_narration' },
	{ name: 'Simran - English - Recovery', value: 'simran_en_recovery' },
	{ name: 'Simran - English - Sales', value: 'simran_en_sales' },
	{ name: 'Simran - English - Therapist', value: 'simran_en_therapist' },
	{ name: 'Simran - English-Hindi - Banking Expressive', value: 'simran_enhi_banking_expressive' },
	{ name: 'Simran - English-Hindi - Companion', value: 'simran_enhi_companion' },
	{ name: 'Simran - English-Hindi - Customer', value: 'simran_enhi_customer' },
	{ name: 'Simran - Hindi - Assistant', value: 'simran_hi_assistant' },
	{ name: 'Simran - Hindi - Automobile', value: 'simran_hi_automobile' },
	{ name: 'Simran - Hindi - Conversation', value: 'simran_hi_conversation' },
	{ name: 'Simran - Hindi - Latenight', value: 'simran_hi_latenight' },
	{ name: 'Simran - Hindi - Narration', value: 'simran_hi_narration' },
	{ name: 'Simran - Hindi - News', value: 'simran_hi_news' },
	{ name: 'Simran - Hindi - News Breaking', value: 'simran_hi_news_breaking' },
	{ name: 'Simran - Hindi - Recovery', value: 'simran_hi_recovery' },
	{ name: 'Simran - Hindi - Sales', value: 'simran_hi_sales' },
	{ name: 'Simran - Hindi - Social Energetic', value: 'simran_hi_social_energetic' },
	{ name: 'Simran - Hindi - Social Excited', value: 'simran_hi_social_excited' },
	{ name: 'Soham - Marathi - Narration', value: 'soham_mr_narration' },
	{ name: 'Sophia - English - Conversational', value: 'sophia_en_conversational' },
	{ name: 'Suchitra - Hindi - Ecomm', value: 'suchitra_hi_ecomm' },
	{ name: 'Suchitra - Kannada - Narration', value: 'suchitra_kn_narration' },
	{ name: 'Suhani - Hindi - Social', value: 'suhani_hi_social' },
	{ name: 'Suman - Hindi - Companion', value: 'suman_hi_companion' },
	{ name: 'Sumit - Hindi - Conversational', value: 'sumit_hi_conversational' },
	{ name: 'Sunny - English - Social', value: 'sunny_en_social' },
	{ name: 'Sunny - English-Hindi - Customer', value: 'sunny_enhi_customer' },
	{ name: 'Sunny - Hindi - Ads', value: 'sunny_hi_ads' },
	{ name: 'Sunny - Hindi - Reels', value: 'sunny_hi_reels' },
	{ name: 'Tanya - Hindi - Narration', value: 'tanya_hi_narration' },
	{ name: 'Tarun - Hindi - Conversational', value: 'tarun_hi_conversational' },
	{ name: 'Tarun - Hindi - Sales', value: 'tarun_hi_sales' },
	{ name: 'Tarun - Telugu - Narration', value: 'tarun_te_narration' },
	{ name: 'Vaibhav - Hindi - Social', value: 'vaibhav_hi_social' },
	{ name: 'Vandana - Hindi - Ecomm', value: 'vandana_hi_ecomm' },
	{ name: 'Varun - English - Ads', value: 'varun_en_ads' },
	{ name: 'Varun - English - Suspense', value: 'varun_en_suspense' },
	{ name: 'Vijay - Tamil - Narration', value: 'vijay_ta_narration' },
	{ name: 'Vipul - Hindi - Social', value: 'vipul_hi_social' },
	{ name: 'Zarina - English - Conversation', value: 'zarina_en_conversation' },
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
