import { useMemo, useState } from 'react';
import { toast } from 'sonner@2.0.3';
import {
  AlertTriangle,
  Eye,
  EyeOff,
  Flag,
  MessageSquare,
  Pin,
  Star,
  ThumbsUp,
} from 'lucide-react';
import {
  CURRENT_USER,
  type EventReview,
  type MockEvent,
} from '../../data/mockEventData';
import { useEventStore } from '../../data/EventStoreContext';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Textarea } from '../ui/textarea';

interface MobileEventReviewsProps {
  event: MockEvent;
  mode: 'learner' | 'admin';
}

const REPORT_REASONS = [
  'Spam or promotion',
  'Harassment or abuse',
  'Off-topic',
  'False or misleading',
  'Privacy concern',
];

function formatReviewDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function sortReviews(reviews: EventReview[]) {
  return [...reviews].sort((a, b) => {
    if (!!a.isPinned !== !!b.isPinned) return a.isPinned ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function renderStars(rating: number, filledClassName = 'text-amber-400') {
  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      className={`size-3.5 ${index < rating ? `${filledClassName} fill-current` : 'text-muted-foreground/30'}`}
    />
  ));
}

export function MobileEventReviews({ event, mode }: MobileEventReviewsProps) {
  const { addReview, updateReview, setReviewReply, removeReviewReply } = useEventStore();
  const reviews = event.reviews || [];
  const visibleReviews = mode === 'admin' ? reviews : reviews.filter((review) => !review.isHidden);

  const [draftRating, setDraftRating] = useState(0);
  const [draftComment, setDraftComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState('');
  const [reportingReviewId, setReportingReviewId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState(REPORT_REASONS[0]);
  const [reportDetails, setReportDetails] = useState('');
  const [helpfulReviewIds, setHelpfulReviewIds] = useState<Set<string>>(new Set());

  const sortedReviews = useMemo(() => sortReviews(visibleReviews), [visibleReviews]);

  const averageRating = useMemo(() => {
    if (visibleReviews.length === 0) return 0;
    const total = visibleReviews.reduce((sum, review) => sum + review.rating, 0);
    return total / visibleReviews.length;
  }, [visibleReviews]);

  const flaggedCount = reviews.filter((review) => review.isFlagged).length;
  const hiddenCount = reviews.filter((review) => review.isHidden).length;
  const canLeaveReview = mode === 'learner' && event.lifecycleStage === 'ended';

  const reviewBeingReported = reviews.find((review) => review.id === reportingReviewId) || null;

  const handleSubmitReview = () => {
    if (draftRating === 0 || !draftComment.trim()) {
      toast.error('Add a rating and a short review.');
      return;
    }

    addReview(event.id, {
      id: `rev-${Date.now()}`,
      author: CURRENT_USER.name,
      avatar: CURRENT_USER.avatar,
      rating: draftRating,
      comment: draftComment.trim(),
      createdAt: new Date().toISOString(),
      helpfulCount: 0,
    });

    setDraftRating(0);
    setDraftComment('');
    toast.success('Review posted');
  };

  const handleToggleHelpful = (review: EventReview) => {
    const alreadyHelpful = helpfulReviewIds.has(review.id);

    setHelpfulReviewIds((prev) => {
      const next = new Set(prev);
      if (alreadyHelpful) next.delete(review.id);
      else next.add(review.id);
      return next;
    });

    updateReview(event.id, review.id, {
      helpfulCount: Math.max(0, review.helpfulCount + (alreadyHelpful ? -1 : 1)),
    });
  };

  const openReplyEditor = (review: EventReview) => {
    setReplyingTo(review.id);
    setReplyDraft(review.hostReply?.comment || '');
  };

  const handleSaveReply = (review: EventReview) => {
    if (!replyDraft.trim()) {
      toast.error('Write a reply before saving.');
      return;
    }

    setReviewReply(event.id, review.id, {
      authorName: CURRENT_USER.name,
      authorAvatar: CURRENT_USER.avatar,
      comment: replyDraft.trim(),
      createdAt: review.hostReply?.createdAt || new Date().toISOString(),
      updatedAt: review.hostReply ? new Date().toISOString() : undefined,
    });

    setReplyingTo(null);
    setReplyDraft('');
    toast.success(review.hostReply ? 'Reply updated' : 'Reply posted');
  };

  const handleSubmitReport = () => {
    if (!reviewBeingReported) return;

    updateReview(event.id, reviewBeingReported.id, { isFlagged: true });
    setReportingReviewId(null);
    setReportReason(REPORT_REASONS[0]);
    setReportDetails('');
    toast.success('Review reported');
  };

  return (
    <div className="px-4 py-4 space-y-4">
      <Card className="p-4 gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base text-card-foreground">Reviews</h2>
            <p className="text-xs text-muted-foreground">
              {visibleReviews.length} visible review{visibleReviews.length === 1 ? '' : 's'}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-1 mb-1">
              {renderStars(Math.round(averageRating), 'text-amber-400')}
            </div>
            <p className="text-sm text-card-foreground">
              {visibleReviews.length === 0 ? 'No ratings yet' : averageRating.toFixed(1)}
            </p>
          </div>
        </div>

        {mode === 'admin' && (
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-[10px]">
              {reviews.length} total
            </Badge>
            <Badge variant="secondary" className="text-[10px]">
              {flaggedCount} flagged
            </Badge>
            <Badge variant="secondary" className="text-[10px]">
              {hiddenCount} hidden
            </Badge>
          </div>
        )}
      </Card>

      {canLeaveReview && (
        <Card className="p-4 gap-3">
          <div>
            <h3 className="text-sm text-card-foreground">Leave a review</h3>
            <p className="text-xs text-muted-foreground">Share what was helpful and what could be better.</p>
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, index) => {
              const value = index + 1;
              const active = value <= draftRating;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDraftRating(value)}
                  className="p-1 active:scale-95 transition-all"
                >
                  <Star className={`size-5 ${active ? 'text-amber-400 fill-current' : 'text-muted-foreground/30'}`} />
                </button>
              );
            })}
          </div>

          <Textarea
            value={draftComment}
            onChange={(event) => setDraftComment(event.target.value)}
            placeholder="What stood out? What should improve next time?"
            className="min-h-24"
          />

          <Button onClick={handleSubmitReview} className="w-full sm:w-auto">
            Post Review
          </Button>
        </Card>
      )}

      {sortedReviews.length === 0 ? (
        <Card className="p-8 text-center gap-2">
          <MessageSquare className="size-9 text-muted-foreground/30 mx-auto" />
          <p className="text-sm text-card-foreground">No reviews yet</p>
          <p className="text-xs text-muted-foreground">
            {canLeaveReview ? 'Be the first to leave feedback for this event.' : 'Reviews will show up here once attendees share feedback.'}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedReviews.map((review) => {
            const isReplying = replyingTo === review.id;

            return (
              <Card key={review.id} className={`p-4 gap-3 ${review.isHidden ? 'border-dashed opacity-80' : ''}`}>
                <div className="flex items-start gap-3">
                  <Avatar className="size-10 flex-shrink-0">
                    <AvatarFallback className="text-xs">{review.avatar}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm text-card-foreground">{review.author}</p>
                          {review.isPinned && (
                            <button
                              type="button"
                              onClick={() => mode === 'admin' && updateReview(event.id, review.id, { isPinned: false })}
                              className="inline-flex"
                            >
                              <Badge variant="secondary" className="text-[10px] gap-1 cursor-pointer">
                                <Pin className="size-3" /> Pinned
                              </Badge>
                            </button>
                          )}
                          {review.isFlagged && (
                            <Badge variant="secondary" className="text-[10px] gap-1 text-amber-700 bg-amber-50 border-amber-200">
                              <AlertTriangle className="size-3" /> Flagged
                            </Badge>
                          )}
                          {review.isHidden && (
                            <Badge variant="secondary" className="text-[10px] gap-1">
                              <EyeOff className="size-3" /> Hidden
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-0.5">{renderStars(review.rating)}</div>
                          <span className="text-[11px] text-muted-foreground">{formatReviewDate(review.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {mode === 'admin' && !review.isPinned && (
                          <button
                            type="button"
                            onClick={() => updateReview(event.id, review.id, { isPinned: true })}
                            className="p-2 rounded-full border border-border text-muted-foreground active:scale-95 transition-all"
                            aria-label="Pin review"
                          >
                            <Pin className="size-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setReportingReviewId(review.id)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11px] text-muted-foreground active:scale-95 transition-all"
                        >
                          <Flag className="size-3.5" /> Flag
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-secondary-foreground leading-relaxed mt-3">{review.comment}</p>

                    {review.hostReply && (
                      <div className="mt-3 rounded-xl bg-muted px-3 py-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Avatar className="size-6">
                            <AvatarFallback className="text-[10px]">{review.hostReply.authorAvatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-[12px] text-card-foreground">{review.hostReply.authorName}</p>
                            <p className="text-[10px] text-muted-foreground">
                              Organizer reply · {formatReviewDate(review.hostReply.updatedAt || review.hostReply.createdAt)}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-secondary-foreground leading-relaxed">{review.hostReply.comment}</p>
                      </div>
                    )}

                    {mode === 'admin' ? (
                      <div className="flex items-center gap-2 flex-wrap mt-3">
                        <Button variant="outline" size="sm" onClick={() => openReplyEditor(review)} className="h-8 text-[11px]">
                          <MessageSquare className="size-3.5" />
                          {review.hostReply ? 'Edit reply' : 'Reply'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateReview(event.id, review.id, { isHidden: !review.isHidden })}
                          className="h-8 text-[11px]"
                        >
                          {review.isHidden ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                          {review.isHidden ? 'Show' : 'Hide'}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-3 mt-3">
                        <button
                          type="button"
                          onClick={() => handleToggleHelpful(review)}
                          className={`inline-flex items-center gap-1.5 text-[12px] active:scale-95 transition-all ${helpfulReviewIds.has(review.id) ? 'text-primary' : 'text-muted-foreground'}`}
                        >
                          <ThumbsUp className="size-3.5" /> Helpful ({review.helpfulCount})
                        </button>
                      </div>
                    )}

                    {mode === 'admin' && isReplying && (
                      <div className="mt-3 space-y-2">
                        <Textarea
                          value={replyDraft}
                          onChange={(event) => setReplyDraft(event.target.value)}
                          placeholder="Write a short organizer reply"
                          className="min-h-24"
                        />
                        <div className="flex items-center gap-2">
                          <Button size="sm" onClick={() => handleSaveReply(review)} className="h-8 text-[11px]">
                            Save reply
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyDraft('');
                            }}
                            className="h-8 text-[11px]"
                          >
                            Cancel
                          </Button>
                          {review.hostReply && (
                            <button
                              type="button"
                              onClick={() => {
                                removeReviewReply(event.id, review.id);
                                setReplyingTo(null);
                                setReplyDraft('');
                                toast.success('Reply removed');
                              }}
                              className="text-[11px] text-destructive"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!reviewBeingReported} onOpenChange={(open) => !open && setReportingReviewId(null)}>
        <DialogContent className="max-w-sm rounded-2xl p-0 overflow-hidden">
          <div className="px-5 pt-5 pb-4 space-y-4">
            <DialogHeader className="text-left">
              <DialogTitle className="text-base">Report review</DialogTitle>
              <DialogDescription>
                This uses the shared reporting flow for review flagging in the prototype.
              </DialogDescription>
            </DialogHeader>

            {reviewBeingReported && (
              <div className="rounded-xl bg-muted px-3 py-3">
                <p className="text-[11px] text-muted-foreground mb-1">Review snippet</p>
                <p className="text-sm text-card-foreground line-clamp-3">{reviewBeingReported.comment}</p>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-[12px] text-card-foreground">Reason</p>
              <div className="flex flex-wrap gap-2">
                {REPORT_REASONS.map((reason) => {
                  const active = reportReason === reason;
                  return (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setReportReason(reason)}
                      className={`rounded-full border px-3 py-1.5 text-[11px] active:scale-95 transition-all ${active ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
                    >
                      {reason}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[12px] text-card-foreground">Details</p>
              <Textarea
                value={reportDetails}
                onChange={(event) => setReportDetails(event.target.value)}
                placeholder="Add context for the moderator team"
                className="min-h-24"
              />
            </div>

            <DialogFooter className="flex-row gap-2 sm:justify-start">
              <Button variant="outline" onClick={() => setReportingReviewId(null)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSubmitReport} className="flex-1">
                Submit report
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
