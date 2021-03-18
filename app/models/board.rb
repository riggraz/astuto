class Board < ApplicationRecord
  has_many :posts, dependent: :destroy
  belongs_to :user
  
  after_initialize :set_order_to_last

  validates :name, presence: true, uniqueness: true
  validates :description, length: { in: 0..1024 }, allow_nil: true

  def set_order_to_last
    return unless new_record?
    return unless order.nil?
    
    order_last = Board.maximum(:order) || 0
    self.order = order_last + 1
  end
end
