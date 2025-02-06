FactoryBot.define do
  factory :o_auth do
    sequence(:name) { |n| "OAuth#{n}" }
    is_enabled { false }
    client_id { "123456" }
    client_secret { "123456" }
    authorize_url { "https://example.com/authorize" }
    token_url { "https://example.com/token" }
    profile_url { "https://example.com/profile" }
    scope { "read" }
    json_user_name_path { "user.name" }
    json_user_email_path { "user.email" }
  end

  factory :default_o_auth, class: OAuth do
    tenant { nil }
    sequence(:name) { |n| "DefaultOAuth#{n}" }
    is_enabled { false }
    client_id { "123456" }
    client_secret { "123456" }
    authorize_url { "https://example.com/authorize" }
    token_url { "https://example.com/token" }
    profile_url { "https://example.com/profile" }
    scope { "read" }
    json_user_name_path { "user.name" }
    json_user_email_path { "user.email" }
  end
end
