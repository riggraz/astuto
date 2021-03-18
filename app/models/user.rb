class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable
  
  has_many :posts, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :boards, dependent: :destroy

  enum role: [:user, :moderator, :admin]
  after_initialize :set_default_role, if: :new_record?
  after_initialize :skip_confirmation, if: :new_record?

  validates :full_name, presence: true, length: { in: 2..32 }

  validates_uniqueness_of :subdomain, message: "is already taken",:allow_blank => true
  validates_format_of :subdomain, with: /\A[a-z0-9_]+\z/, message: "must be lowercase alphanumerics only",:allow_blank => true
  validates_length_of :subdomain, maximum: 32, message: "exceeds maximum of 32 characters"
  validates_exclusion_of :subdomain, in: ['www', 'mail', 'ftp'], message: "not available"


  def set_default_role
    self.role ||= :user
  end

  def skip_confirmation
    return if Rails.application.email_confirmation?
    skip_confirmation!
    skip_confirmation_notification!
    skip_reconfirmation!
  end

  def gravatar_url
    gravatar_id = Digest::MD5::hexdigest(email.downcase)
    "https://secure.gravatar.com/avatar/#{gravatar_id}"
  end

  def power_user?
    role == 'admin' || role == 'moderator'
  end
end
